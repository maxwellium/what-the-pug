import { Parser } from 'htmlparser2';

export const enum Quote {
  SINGLE = "'",
  DOUBLE = '"'
}

export function escape( src: string, quote: Quote ) {
  return quote === Quote.SINGLE ?
    src.replace( /'/g, "\\'" ) :
    src.replace( /"/g, '\\"' );
}

export function transform(
  html: string,
  quote = Quote.SINGLE,
  indent = 2
) {

  let output: string[] = [],
    level = 0,
    dotmode = false;

  const onopentag = (
    name: string,
    attribs: { [ k: string ]: string }
  ) => {

    let classList: string[] = [],
      attributeList: { key: string, val: string }[] = [],
      tag = name;

    if ( 'script' === name.toLowerCase() ) {
      dotmode = true;
    }

    for ( let key in attribs ) {

      switch ( key.toLowerCase() ) {
        case 'class':
          classList = attribs[ key ].split( ' ' ).map( s => '.' + s );
          continue;
        case 'id':
          tag += '#' + attribs[ key ];
          continue;
      }

      const val = `${ quote }${ escape( attribs[ key ], quote ) }${ quote }`;

      if ( /^[\w-]+$/.test( key ) ) {

        attributeList.push( { key, val } );

      } else {

        attributeList.push( {
          key: `${ quote }${ escape( key, quote ) }${ quote }`,
          val
        } );

      }

    }


    tag += classList.join( '' );

    if ( attributeList.length ) {
      tag += `(${
        attributeList
          .map( ( { key, val } ) => `${ key }=${ val }` )
          .join( '' )
        })`;
    }

    tag = tag.replace( /^div([\.#])/, '$1' );

    output.push( ' '.repeat( level * indent ) + tag );

    level++;
  };

  const ontext = ( text: string ) => {

    let lines = text
      .split( '\n' )
      .map( s => dotmode ? s.replace( /^\s+$/, '' ) : s.trimLeft() )
      .filter( s => s.length );

    if ( !lines.length ) { return; }

    if ( dotmode ) {

      let [ _w ] = lines[ 0 ].match( /^\s*/ ) || [ '' ];

      if ( _w.length ) {
        lines = lines.map( s => s.replace( new RegExp( '^' + _w ), '' ) );
      }

      output[ output.length - 1 ] += '.';
    }

    if ( !dotmode && 1 === lines.length && output.length ) {
      output[ output.length - 1 ] += ` ${ lines[ 0 ] }`;
    } else {
      output.push(
        lines
          .map( s => `${ ' '.repeat( level * indent ) }${ dotmode ? '' : '| ' }${ s }` )
          .join( '\n' )
      );
    }

  };

  const onclosetag = () => {
    dotmode = false;
    level--;
  };


  const parser = new Parser( {
    onopentag,
    ontext,
    onclosetag
  }, { decodeEntities: true, lowerCaseAttributeNames: false } );

  parser.write( html );
  parser.end();

  return output;
}
