/**
 * Класс PreviewModal
 * Используется как обозреватель загруженный файлов в облако
 */
class PreviewModal extends BaseModal {
  constructor( element ) {
    super(element);
    this.modalPreviewer = document.querySelector('.uploaded-previewer-modal');
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по контроллерам изображения: 
   * Отправляет запрос на удаление изображения, если клик был на кнопке delete
   * Скачивает изображение, если клик был на кнопке download
   */
  registerEvents() {
    this.modalPreviewer.querySelector('.header i').addEventListener('click', () => {
      this.close();
    })

    this.modalPreviewer.querySelector('.content').addEventListener('click', (event) => {
      if (event.target.classList.contains('delete')) {
        event.target.querySelector('i').classList.add('icon', 'spinner', 'loading')
        event.target.classList.add('disabled')
        Yandex.removeFile(event.target.dataset.path, response => {
          console.log(response)
          if(!response) {
            event.target.closest('.image-preview-container').remove()
          }
        })
      }

      if (event.target.classList.contains('download')) {   
        console.log(event.target)
        Yandex.downloadFileByUrl(event.target.dataset.file)
      } 
    })
  }

  /**
   * Отрисовывает изображения в блоке всплывающего окна
   */
  showImages(data) {
    const items = data.items.reverse();
    const imgHTML = [];
    
    if (data.items.length > 0) {
      for (const image of items) {
        imgHTML.push(this.getImageInfo(image));
      }
    }
    this.modalPreviewer.querySelector('.content').innerHTML = imgHTML.join('');
  }

  /**
   * Форматирует дату в формате 2021-12-30T20:40:02+00:00(строка)
   * в формат «30 декабря 2021 г. в 23:40» (учитывая временной пояс)
   * */
  formatDate(date) {
    const dateFormated = new Date(date);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    };
    return dateFormated.toLocaleString("ru", options);
  }

  /**
   * Возвращает разметку из изображения, таблицы с описанием данных изображения и кнопок контроллеров (удаления и скачивания)
   */
  getImageInfo(item) {
    return `
        <div class="image-preview-container">
        <img src='${item.file}' />
        <table class="ui celled table">
        <thead>
          <tr><th>Имя</th><th>Создано</th><th>Размер</th></tr>
        </thead>
        <tbody>
          <tr><td>${item.name}</td><td>${this.formatDate(item.created)}</td><td>${Math.round(item.size/1024)}Кб</td></tr>
        </tbody>
        </table>
        <div class="buttons-wrapper">
          <button class="ui labeled icon red basic button delete" data-path='${item.path}'>
            Удалить
            <i class="trash icon"></i>
          </button>
          <button class="ui labeled icon violet basic button download" data-file='${item.file}'>
            Скачать
            <i class="download icon"></i>
          </button>
        </div>
      </div>
    `
  };
}
