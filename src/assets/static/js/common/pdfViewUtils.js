function showPdfAllPage(url) {
	PDFJS.getDocument(url).then(function getPdfHelloWorld(pdf) {
		for (var i = 0; i <= pdf.numPages; i++) {
			pdf.getPage(i).then(function getPageHelloWorld(page) {
				var scale = 1;
				var viewport = page.getViewport(scale);
				var canvas = document.createElement('canvas');
				var context = canvas.getContext('2d');
				canvas.height = viewport.height;
				canvas.width = viewport.width;
				$(".pic-HT").append(canvas);
				page.render({
					canvasContext : context,
					viewport : viewport
				});
			});
		}
	});
}