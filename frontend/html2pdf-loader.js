// html2pdf.js CDN loader
(function() {
  var script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
  script.onload = function() {
    window.html2pdfLoaded = true;
  };
  document.head.appendChild(script);
})();
