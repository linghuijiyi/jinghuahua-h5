import axios from 'axios';

const http = function(url, type, data, contentType) {
    let option = {
        url: url,
        method: type,
        transformRequest: [
            function(data) {
                let result = '';
                for (let value in data) result += encodeURIComponent(value) + '=' + encodeURIComponent(data[value]) + '&';
                if (result) result = result.substring(0, result.length - 1);
                return result;
            }
        ],
        paramsSerializer: (params) => {
            let result = '';
            for (let value in params) result += encodeURIComponent(value) + '=' + encodeURIComponent(data[value]) + '&';
            if (result) result = result.substring(0, result.length - 1);
            return result;
        },
        headers: {
            'Content-Type': contentType ? 'application/json;charset=UTF-8' : 'application/x-www-form-urlencoded'
        },

    }
    type === 'get' ? option.params = (data) : option.data = data;
    return new Promise((resolve, reject) => {
        axios.request((option)).then((res) => resolve(res)).catch((err) => reject(err))
    });
}

export default http;