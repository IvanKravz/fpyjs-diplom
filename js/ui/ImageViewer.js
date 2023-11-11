/**
 * Класс ImageViewer
 * Используется для взаимодействием блоком изображений
 * */
class ImageViewer {
  constructor( element ) {
    this.element = element;
    // console.log(this.element)
    this.imageBlock = this.element.querySelector('.images-list');
    // console.log(this.imageBlock)
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по изображению меняет класс активности у изображения
   * 2. Двойной клик по изображению отображает изображаения в блоке предпросмотра
   * 3. Клик по кнопке выделения всех изображений проверяет у всех ли изображений есть класс активности?
   * Добавляет или удаляет класс активности у всех изображений
   * 4. Клик по кнопке "Посмотреть загруженные файлы" открывает всплывающее окно просмотра загруженных файлов
   * 5. Клик по кнопке "Отправить на диск" открывает всплывающее окно для загрузки файлов
   */
  registerEvents(){
    // Двойной клик по фотографии

    this.imageBlock.addEventListener('dblclick', (event) => {
      if (event.target.tagName === 'IMG') {
        let imgSrc = event.target.src;
        this.element.querySelector('.image').setAttribute('src', imgSrc);
    }
    })
    
    // Один клик по фотографии

    this.imageBlock.addEventListener('click', (event) => {
      if (event.target.tagName === 'IMG') {
        event.target.classList.toggle('selected');
      }
      this.checkButtonText();
    });

    // Клик по кнопке "Выбрать всё" / "Снять выделение"

    const btnSelectAll = this.element.querySelector('.select-all');
    btnSelectAll.addEventListener('click', () => {
      let imgList = this.element.querySelectorAll('.row .four img')
      let imgSelected = Array.from(imgList).every(image => image.classList.contains('selected'))
      imgList.forEach(el => {
        el.classList.toggle('selected', !imgSelected)
        this.checkButtonText();
        })
    });

    // Клик по кнопке "Посмотреть загруженные файлы"

    const btnShowLoadFiles = this.element.querySelector('.show-uploaded-files')
    btnShowLoadFiles.addEventListener('click', () => {
    const modalPreviewer = App.getModal('filePreviewer');
    modalPreviewer.innerHTML = '<i class="asterisk loading icon massive"></i>';
    modalPreviewer.open();
    
    Yandex.getUploadedFiles(data => {
      modalPreviewer.showImages(data)
    })
    })

    // Клик по кнопке "Отправить на диск"
    const btnSend = this.element.querySelector('.send')
    
    btnSend.addEventListener('click', () => {
    let modalSend = App.getModal('fileUploader');
    let imgSelectSend = Array.from(this.element.querySelectorAll('.selected'));
    let imgSrc = imgSelectSend.map(el => el.src);
    modalSend.showImages(imgSrc);
    modalSend.open();
    })
  }

  /**
   * Очищает отрисованные изображения
   */
  clear() {
    document.querySelector('.images-list .grid .row').innerHTML = '';
  }

  /**
   * Отрисовывает изображения.
  */
  drawImages( images ) {
    if (images.length > 0) {
      document.querySelector('.select-all').classList.remove('disabled');
      images.forEach(element => {
        imageAvailable(element).then(isImg => {
          if(isImg) {
            const imageElement = document.createElement('div');
            imageElement.classList.add('four', 'wide', 'column', 'ui', 'medium', 'image-wrapper');
            imageElement.innerHTML = `<img src='${element}'/>`;
            document.querySelector('.images-list .grid .row').append(imageElement);
          }
        })
      });
    } else {
      document.querySelector('.select-all').classList.add('disabled');
    }

    function imageAvailable(src) {
      return fetch(src, {
        method: "GET",
      })
          .then(response => {
            return response.ok;
          })
          .catch(error => {
            console.error(error)
            return false
          })
    };
  };

  /**
   * Контроллирует кнопки выделения всех изображений и отправки изображений на диск
   */
  checkButtonText(){
    let btnSelectAll = this.element.querySelector('.select-all');
    let btnSend = this.element.querySelector('.ui .send');
    let imgSelected =  Array.from(this.element.querySelectorAll('.row .four img'))
    let imgSend = imgSelected.some(el => el.classList.contains('selected'))

    if (imgSelected.every(el => el.classList.contains('selected'))) {
      btnSelectAll.textContent = "Снять выделение"
    } else {
      btnSelectAll.textContent = "Выбрать всё"
      btnSend.classList.add('disabled')
    }

    btnSend.classList.toggle('disabled', !imgSend)
  };
}