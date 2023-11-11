/**
 * Класс FileUploaderModal
 * Используется как всплывающее окно для загрузки изображений
 */
class FileUploaderModal extends BaseModal {
  constructor( element ) {
    super(element);
    this.uploadWindow = document.querySelector('.file-uploader-modal');
    this.contentUploadModel = this.uploadWindow.querySelector('.content');
    this.btnClose = this.uploadWindow.querySelector(".close.button");
    this.iconClose = this.uploadWindow.querySelector(".header i");
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по кнопке "Закрыть" на всплывающем окне, закрывает его
   * 3. Клик по кнопке "Отправить все файлы" на всплывающем окне, вызывает метод sendAllImages
   * 4. Клик по кнопке загрузке по контроллерам изображения: 
   * убирает ошибку, если клик был по полю вода
   * отправляет одно изображение, если клик был по кнопке отправки
   */
  registerEvents(){

     // Клик по крестику на всплывающем окне и клик по кнопке "Закрыть" на всплывающем окне 
    this.iconClose.addEventListener('click', () => {
      this.close()
    });

    this.btnClose.addEventListener('click', () => {
      this.close()
    });

    this.uploadWindow.addEventListener('click', (event) => {

      // Клик по кнопке "Отправить все файлы"
      if (event.target.classList.contains('send-all')) {
        this.sendAllImages()
      };

      // Удалить класс error у блока с классом input
      if (event.target.tagName === 'INPUT') {
        event.target.parentElement.classList.remove('error')
      }
      
      // Передавать весь блок контейнер изображения 
      if (event.target.tagName === 'BUTTON') {
        this.sendImage(event.target.closest('.image-preview-container'))
      }
    })

  }
  /**
   * Отображает все полученные изображения в теле всплывающего окна
   */
  showImages(images) {
    images.reverse();
    const imagesHTML = [];
    for (const src of images) {
      imagesHTML.push(this.getImageHTML(src));
      this.contentUploadModel.innerHTML = imagesHTML;
    }
  }

  /**
   * Формирует HTML разметку с изображением, полем ввода для имени файла и кнопкной загрузки
   */
  getImageHTML(item) {
    return `
    <div class="image-preview-container">
    <img src= '${item}' />
    <div class="ui action input">
      <input type="text" placeholder="Путь к файлу">
      <button class="ui button"><i class="upload icon"></i></button>
    </div>
  </div>`
  }

  /**
   * Отправляет все изображения в облако
   */
  sendAllImages() {
    const imageContainer = this.contentUploadModel.querySelectorAll('.image-preview-container')
    imageContainer.forEach(el => {
      this.sendImage(el)
    })
  }

  /**
   * Валидирует изображение и отправляет его на сервер
   */
  sendImage(imageContainer) {
    const input = imageContainer.querySelector('input')
    const inputTrim = imageContainer.querySelector('input').value.trim();
    const nameFile = inputTrim + '.png'
    const imgSrc = imageContainer.querySelector('img').src
    
    if (inputTrim) {
      input.classList.add('disabled')
      Yandex.uploadFile(nameFile, imgSrc, () => {
        if (this.contentUploadModel.children.length === 1) {
          this.close()
        }
        imageContainer.remove();
      })
    } else {
      input.parentElement.classList.add('error')
    }
  }
}