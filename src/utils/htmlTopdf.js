// 导出页面为PDF格式
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
export default {
  install(Vue, options) {
    Vue.prototype.getPdf = function() {
      // eslint-disable-next-line no-unused-vars
      setTimeout(() => {
        var title = this.htmlTitle
        var c = document.createElement('canvas')
        const rect = document.querySelector('#pdfDom').getBoundingClientRect()
        // const scrollTop = document.documentElement.scrollTop || document.body.scrollTop// 获取滚动轴滚动的长度
        console.log(document.querySelector('#pdfDom').getBoundingClientRect())  //eslint-disable-line
        c.width = rect.width * 6
        c.height = rect.height * 6
        c.getContext('2d').scale(6, 6)
        window.pageYOffset = 0
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
        html2Canvas(document.querySelector('#pdfDom'), {
          allowTaint: true,
          useCORS: true,
          scale: 1,
          canvas: c,
          logging: true,
          dpi: window.devicePixelRatio * 96,
          width: rect.width,
          height: rect.height
        }).then(function(canvas) {
            const contentWidth = canvas.width
            const contentHeight = canvas.height
            const pageHeight = contentWidth * 1.5 / 592.28 * 841.89
            let leftHeight = contentHeight
            let position = 0
            const imgWidth = 595.28
            const imgHeight = 592.28 / contentWidth * contentHeight
            const pageData = canvas.toDataURL('image/jpeg', 1.0)
            const PDF = new JsPDF('', 'pt', 'a4')
            // console.log(canvas.toDataURL()) // eslint-disable-line
            if (leftHeight < pageHeight) {
              PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
            } else {
              while (leftHeight > 0) {
                PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                leftHeight -= pageHeight
                position -= 841.89
                if (leftHeight > 0) {
                  PDF.addPage()
                }
              }
            }
            PDF.save(title + '.pdf')
          }
        )
      }, 500)
    }
  }
}
