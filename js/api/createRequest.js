/**
 * Основная функция для совершения запросов по Yandex API.
 * */
const createRequest = (options = {}, callback) => {
    const params = new URLSearchParams(options.data)
    const url = new URL(options.url)
    url.search = params.toString()

    fetch(url.href, {
        method: options.method,
        headers: options.headers,
        credentials: 'include',
    })
        .then(response => {
            if (response.status < 204) {
                return response.json()
            } else if (response.status === 204) {
                return false
            } else {
                throw new Error('Response was not ok');
            }
        })
        .then (data => {
            return callback(data)
        })
        .catch(error => {
            console.error(error)
        })
}