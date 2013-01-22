var root = '../..';

exports.documentReady = function(hook, context){
  var button = $('#compileLatex');
  var mode = 'compile';

  jQuery.getScript(root+'texlive/website/pdftex.js/release/pdftex-webworker.js');
  jQuery.getScript(root+'texlive/website/pdftex.js/release/pdftex.js');
  jQuery.getScript(root+'texlive/website/texlive.js');

  var pdf;
  button.click(function() {
    if(mode==='compile') {
      button.append('<div id="msg">compiling</div>');
    
      var pdftex = new PDFTeX();

      pdftex.on_stdout = function(txt) { }
      pdftex.on_stderr = function(txt) { }

      var texlive = new TeXLive(pdftex);
      
      var url = document.URL+'/export/txt';
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, false);

      xhr.onreadystatechange = function(ev) {
        var code = ev.responseText;     
        texlive.compile(code, root, function(data) {
          button.find('#msg').text('click to open');
          pdf = data;
          mode = 'open';
        });
      };

      xhr.send(null);
    }
    else {
       mode = 'compile';
       window.open('data:application/pdf;base64,'+window.btoa(pdf));
    }
  });
}
