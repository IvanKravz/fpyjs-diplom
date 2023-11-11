/**
 * Класс VK
 * Управляет изображениями из VK. С помощью VK API.
 * С помощью этого класса будет выполняться загрузка изображений из vk.
 * Имеет свойства ACCESS_TOKEN и lastCallback
 * */
class VK {

  static ACCESS_TOKEN = 'vk1.a.PnlUz42dofSQUN5dSMq5-_Pw0H3mv-QPxBp93ySbWV6fpytGtTeBepSivIQYxoXWXuKv5_cKmAZxihoaQNorE7RWOkGoQj6VTLaoqCyMo7lltELArEmf-PWHjXWCvlizVWSgx2iUawgN97JGm6bN2uKgq7sV2FbPC6i6T_SBptmwvc69J5hRWAbKUT6pv94Eo913oI7VmdVRT_e6jXvD9A';
  static lastCallback;

  /**
   * Получает изображения
   * */
  static get(id = " ", callback){
    this.lastCallback = callback;
    let count = 5
    const script = document.createElement('script');
    script.id = 'script'
    script.src = `https://api.vk.com/method/photos.get?owner_id=${id}&album_id=profile&extended=1&photo_sizes=1&count=${count}&callback=VK.processData
                  &access_token=${this.ACCESS_TOKEN}&v=5.154`;
    document.body.append(script); 
  };

  /**
   * Передаётся в запрос VK API для обработки ответа.
   * Является обработчиком ответа от сервера.
   */
  static processData(result){
    document.getElementById('script').remove();
    
    if (result.response) {
      const photos = result.response.items;
      const photosList = [];

      if (photos.length === 0) {
        alert('Фотографии у профиля отсутствуют')
      }

      photos.forEach(element => {
        const photosUrlList = element.sizes.at(-1).url;
        photosList.push(photosUrlList)
      });
      this.lastCallback(photosList)
      this.lastCallback = () => {};

    } else if (result.error) {
      alert(`Ошибка: "${result.error.error_msg}"`);
    }
    
  };
}