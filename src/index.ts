import { Parser, DomHandler } from 'htmlparser2';

export const enum Quote {
  SINGLE = '\'',
  DOUBLE = '"'
}

export const enum Indentation {
  SPACE = ' ',
  TAB = '\t'
}

export function escape( src: string, quote: Quote ) {
  return quote === Quote.SINGLE ?
    src.replace( /'/g, '\\\'' ) :
    src.replace( /"/g, '\\"' );
}

export function transform(
  html: string,
  quote = Quote.SINGLE,
  indentSize = 2,
  indentChar = Indentation.SPACE
) {

  let output: string[] = [];
  let level = 0;
  let dotMode = false;

  const onopentag = (
    name: string,
    attribs: { [ k: string ]: string }
  ) => {

    let classList: string[] = [];
    let attributeList: { key: string, val: string }[] = [];
    let tag = name;

    if ( 'script' === name.toLowerCase() ) {
      dotMode = true;
    }

    for ( const key in attribs ) {

      switch ( key.toLowerCase() ) {
        case 'class':
          classList = attribs[ key ].split( /\s/ ).map( s => '.' + s );
          continue;
        case 'id':
          tag += '#' + attribs[ key ];
          continue;
      }

      const val = `${ quote }${ escape( attribs[ key ], quote ) }${ quote }`;

      attributeList.push( { key, val } );

    }


    tag += classList.join( '' );

    if ( 1 == attributeList.length ) {
      tag += `(${
        attributeList
          .map( ( { key, val } ) => `${ key }=${ val }` )
          .join( ', ' )
        })`;
    } else if ( attributeList.length > 1 ) {
      tag += `(\n${
        attributeList
          .map( ( { key, val } ) => `${ indentChar.repeat( ( level + 1 ) * indentSize ) }${ key }=${ val }` )
          .join( ',\n' )
        }\n${ indentChar.repeat( level * indentSize ) })`;
    }

    tag = tag.replace( /^div([\.#])/, '$1' );

    output.push( indentChar.repeat( level * indentSize ) + tag );

    level++;
  };

  const ontext = ( text: string ) => {

    let lines = text
      .split( '\n' )
      .map( s => dotMode ? s.replace( /^\s+$/, '' ) : s.trimLeft() )
      .filter( s => s.length );

    if ( !lines.length ) { return; }

    if ( dotMode ) {

      let [ _w ] = lines[ 0 ].match( /^\s*/ ) || [ '' ];

      if ( _w.length ) {
        lines = lines.map( s => s.replace( new RegExp( '^' + _w ), '' ) );
      }

      output[ output.length - 1 ] += '.';
    }

    if ( !dotMode && 1 === lines.length && output.length ) {
      output[ output.length - 1 ] += ` ${ lines[ 0 ] }`;
    } else {
      output.push(
        lines
          .map( s => `${ indentChar.repeat( level * indentSize ) }${ dotMode ? '' : '| ' }${ s }` )
          .join( '\n' )
      );
    }

  };

  const onclosetag = () => {
    dotMode = false;
    level--;
  };


  const onprocessinginstruction = ( name: string, data: string ) => {
    if ( 'doctype' === name.toLowerCase().substr( 1 ) ) {
      let doctype = data.split( ' ' )[ 1 ] || 'html';

      output.push( indentChar.repeat( level * indentSize ) + `doctype ${ doctype }` );
    }
  }

  const parser = new Parser( <DomHandler> {
    onopentag,
    ontext,
    onclosetag,
    onprocessinginstruction
  }, { decodeEntities: true, lowerCaseAttributeNames: false } );

  parser.write( html );
  parser.end();

  return output;
}
