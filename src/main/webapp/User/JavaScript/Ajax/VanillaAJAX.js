import serverContextPath from "./serverContextPath.js";
import { AjaxRequestError, AjaxRequestErrorType } from "./AjaxError.js";

class VanillaAJAX {
    #baseURL = serverContextPath;

    constructor(newURL) {
        if (newURL && typeof newURL === 'string' && newURL.length > 0) {
            this.#baseURL = newURL;
        }
    }

    request(method, endpoint, data = null, headers = {}) {
        return new Promise((resolve, reject) => {
            let ajaxRequest;

            if (window.XMLHttpRequest) {
                ajaxRequest = new XMLHttpRequest();
            } else if (window.ActiveXObject) {
                ajaxRequest = new ActiveXObject('Microsoft.XMLHTTP');
            } else {
                reject(new AjaxRequestError(
                    AjaxRequestErrorType.NO_AJAX_SUPPORT,
                    'Browser does not support AJAX requests'
                ));
                return;
            }

            const url = `${this.#baseURL}${endpoint}`;
            ajaxRequest.open(method, url, true);

            ajaxRequest.withCredentials = true;

            // Set default Content-Type header
            ajaxRequest.setRequestHeader('Content-Type', 'application/json');

            // Add any custom headers
            Object.entries(headers).forEach(([key, value]) => {
                ajaxRequest.setRequestHeader(key, value);
            });

            ajaxRequest.onload = () => {
                if (ajaxRequest.status >= 200 && ajaxRequest.status < 300) {
                    const responseText = ajaxRequest.responseText;
                    console.log('Raw response:', responseText);

                    try {
                        const response = responseText
                            ? JSON.parse(responseText)
                            : null;
                        resolve(response);
                    } catch (parseError) {
                        console.error('Response parsing failed:', parseError);
                        console.error('Problematic response:', responseText);
                        reject(new AjaxRequestError(
                            AjaxRequestErrorType.PARSING_ERROR,
                            `Failed to parse response: ${parseError.message}`
                        ));
                    }
                } else {
                    reject(new AjaxRequestError(
                        AjaxRequestErrorType.HTTP_ERROR,
                        `HTTP error: ${ajaxRequest.status} - ${ajaxRequest.statusText}`
                    ));
                }
            };

            ajaxRequest.onerror = () => {
                reject(new AjaxRequestError(
                    AjaxRequestErrorType.NETWORK_ERROR,
                    'Network error occurred'
                ));
            };

            // Send request
            if (method === 'POST' || method === 'PUT') {
                const jsonBody = data ? JSON.stringify(data) : null;
                console.log('Sending JSON:', jsonBody);
                ajaxRequest.send(jsonBody);
            } else {
                ajaxRequest.send(); // GET, DELETE without body
            }
        });
    }

    /*
        request(method, endpoint, data = null, headers = {}) {
            return new Promise((resolve, reject) => {
                let ajaxRequest;
                if (XMLHttpRequest) {
                    ajaxRequest = new XMLHttpRequest();
                } else if (ActiveXObject) {
                    ajaxRequest = new ActiveXObject('Microsoft.XMLHTTP');
                } else {
                    reject(new AjaxRequestError(
                        AjaxRequestErrorType.NO_AJAX_SUPPORT,
                        'Browser does not support AJAX requests'
                    ));
                    return;
                }
    
                const url = `${this.#baseURL}${endpoint}`;
                ajaxRequest.open(method, url, true);
    
                // Set default headers
                ajaxRequest.setRequestHeader('Content-Type', 'application/json');
    
                // Add custom headers
                Object.entries(headers).forEach(([key, value]) => {
                    ajaxRequest.setRequestHeader(key, `${value}`);
                });
    
                ajaxRequest.onload = () => {
                    if (ajaxRequest.status >= 200 && ajaxRequest.status < 300) {
                        const responseText = ajaxRequest.responseText;
                        console.log('Raw response:', responseText); // Log raw response
    
                        try {
                            // Check if response is already an object or needs parsing
                            const response = responseText
                                ? (typeof responseText === 'string'
                                    ? JSON.parse(responseText)
                                    : responseText)
                                : null;
                            resolve(response);
                        } catch (parseError) {
                            console.error('Response parsing failed:', parseError);
                            console.error('Problematic response:', responseText);
                            reject(new AjaxRequestError(
                                AjaxRequestErrorType.PARSING_ERROR,
                                `Failed to parse response: ${parseError.message}`
                            ));
                        }
                    } else {
                        reject(new AjaxRequestError(
                            AjaxRequestErrorType.HTTP_ERROR,
                            `HTTP error: ${ajaxRequest.status} - ${ajaxRequest.statusText}`
                        ));
                    }
                };
    
                ajaxRequest.onerror = () => {
                    console.error('Network error details:', ajaxRequest);
                    reject(new AjaxRequestError(
                        AjaxRequestErrorType.NETWORK_ERROR,
                        `Network error: ${ajaxRequest.statusText}`
                    ));
                };
    
                ajaxRequest.ontimeout = () => reject(new AjaxRequestError(
                    AjaxRequestErrorType.TIMEOUT_ERROR,
                    'Request timed out'
                ));
    
                // Send data
                ajaxRequest.send(data ? JSON.stringify(data) : null);
            });
        }
        */

    get(endpoint, data, headers) {

        /*
        return this.request('GET', endpoint, data, headers);
        */

        // Build query string from `data` object
        const queryString = new URLSearchParams(data).toString();

        // Append to endpoint if there's any data
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;

        return this.request('GET', url, null, headers);

    }

    post(endpoint, data, headers) {
        console.log(data);
        return this.request('POST', endpoint, data, headers);
    }
}

export default VanillaAJAX;