const { transform } = require( 'what-the-pug' );


function debounce( func, wait = 100 ) {
  let timeout;
  return function () {
    clearTimeout( timeout );
    timeout = setTimeout( func, wait );
  };
}

function htmlToPug() {
  try {
    const html = editorHTML.getValue();
    const pug = transform( html );
    editorPug.setValue( pug.join( '\n' ) );
  } catch ( e ) {
    console.error( e );
  }
}
const debounced = debounce( htmlToPug, 400 );

const editorHTML = window.ace.edit( 'html-editor' );
editorHTML.setTheme( 'ace/theme/monokai' );
editorHTML.session.setMode( 'ace/mode/html' );
editorHTML.session.setOptions( { tabSize: 2 } );
editorHTML.on( 'change', debounced );

const editorPug = window.ace.edit( 'pug-editor' );
editorPug.setTheme( 'ace/theme/monokai' );
editorPug.session.setMode( 'ace/mode/jade' );
editorPug.session.setOptions( { tabSize: 2 } );

debounced();
