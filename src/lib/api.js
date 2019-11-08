const API_ADDRESS = "http://127.0.0.1:8888/api";

const request = (path) => {
  return new Promise((resolve, reject) => {
    fetch(`${API_ADDRESS}/${path}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    })
    .then(res => res.json())
    .then(res => resolve(res))
    .catch(err => reject(err));
  });
};

export function getUsers () {
  return request("users");
}

export function getMetrics() {
  return request("metrics");
}

export function getUsersFor(aUserId, aMetric, aLimit) {
  return request(`matches/${aUserId}?metric=${aMetric}&limit=${aLimit}`);
}

export function getMoviesFor(aUserId, aMetric, aLimit) {
  return request(`movies/${aUserId}?metric=${aMetric}&limit=${aLimit}`);
}

export function getItemBasedMoviesFor(aUserId, aLimit) {
  return request(`movies/${aUserId}?metric=ib&limit=${aLimit}`);
}
