import dic from '@/assets/js/dic'
export default {
  data() {
    return {
      files: null,
      directory: true,
      filePage: 1,
      fileLimit: 9999,
      fileTableData: null,
      dic,
      forms: null,
      headerApt: '',
      aptList: JSON.parse(localStorage.getItem('APT_LIST')),
      selection: null,
      emailListData: null,
      emailFileTitle: '',
      emailListDialogVisible: false,
      emailFullscreen: false
    }
  },
  methods: {
    async handleFileChange(files) {
      if (files) {
        this.domainList = []
        this.canImport = true
        this.files = files
      }
    },
    transformSize(size) {
      const KB = (size / 1024).toFixed(2)
      if (KB > 1024) {
        return (KB / 1024).toFixed(2) + 'MB'
      }
      return KB + 'KB'
    },
    handleFileSize(size) {
      this.fileLimit = size
    },
    handleFilePage(page) {
      this.filePage = page
    },
    deleteFile(index) {
      this.fileTableData.splice((this.filePage - 1) * this.fileLimit + index, 1)
      if (this.forms) {
        this.forms.splice((this.filePage - 1) * this.fileLimit + index, 1)
      }
      this.updateFileIndex((this.filePage - 1) * this.fileLimit + index)
    },
    updateProgress(item) {
      return e => {
        item.percentage = parseInt(String((e.loaded / e.total) * 100))
      }
    },
    updateFileIndex(index) {
      for (let i = index; i < this.fileTableData.length; i++) {
        this.fileTableData[i].index -= 1
      }
    },
    async startUpload() {
      if (!this.fileTableData) {
        return
      }
      this.forms = []
      this.fileTableData.forEach((item) => {
        const formData = new FormData()
        const uploadType = this.directory ? 'eml' : 'xls'
        formData.append('file', item.file)
        formData.append('uploadType', uploadType)
        if (item.apt.length > 0) {
          formData.append('apt', item.apt)
        }
        this.forms.push(formData)
      })
      await this.sendRequest()
    },
    async sendRequest(max = 4) {
      return new Promise((resolve, reject) => {
        let counter = 0
        const start = async() => {
          const len = this.forms.length
          while (counter < len && max > 0) {
            max--
            const idx = this.fileTableData.findIndex(v => v.status === this.STATUS.WAITING)
            if (idx === -1) {
              return
            }
            this.fileTableData[idx].status = this.STATUS.UPLOADING
            this.uploadFunc(this.forms[idx], this.updateProgress(this.fileTableData[idx])).then((res) => {
              this.fileTableData[idx].status = this.STATUS.DONE
              this.handleResponse(res.data, idx)
              max++
              counter++
              if (counter === len) {
                resolve()
              } else {
                start()
              }
            }).catch(() => {
              this.fileTableData[idx].status = this.STATUS.ERROR
              this.fileTableData[idx].percentage = 100
              max++
              counter++
              if (counter === len) {
                resolve()
              } else {
                start()
              }
            })
          }
        }
        start()
      })
    },
    showEmailList(data) {
      this.emailListData = data.result
      this.emailFileTitle = data.filename
      this.emailListDialogVisible = true
    }
  }
}
