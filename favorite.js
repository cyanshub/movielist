const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'

// 從 localStorage 取出已經收藏的電影
const movies = JSON.parse( localStorage.getItem('favoriteMovies') )|| []



// 選取 index.html 中的目標容器
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')



// 設計一個函式讀取 WEB API 的電影資料
function renderMovieList(data) {
  let rawHTML = ''
  // Processing data (使用 forEach 處理陣列資料)
  // item = 陣列裡面的個別元素
  data.forEach((item) => {
    // console.log(item)
    // 需要 title, image
    rawHTML += `
      <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src=${POSTER_URL + item.image}
              class="card-img-top" alt="Movie Poster">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
                data-bs-target="#movie-modal" data-id=${item.id}>More</button>
              <button class="btn btn-danger btn-remove-favorite" data-id=${item.id}>X</button>

            </div>
          </div>
        </div>
      </div>
    `
  })
  // 寫入選取的 HTML 容器中
  dataPanel.innerHTML = rawHTML
}


// 監聽點擊事件動態獲取 id 之觸發函式
function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(INDEX_URL + id).then(response => {
    console.log(response)
    // 簡化需要的資料
    const data = response.data.results

    // 寫入選取的 HTML 容器中
    modalTitle.innerHTML = data.title
    modalDate.innerHTML = "Released data: " + data.release_date
    modalDescription.innerHTML = data.description
    modalImage.innerHTML = `
    <img src= ${POSTER_URL + data.image} alt="Movie Poster" class="image-fluid">
    `
  })

}


// // 監聽點擊事件動態獲取 id 之觸發函式
// function addToFavorite(id) {
//   // 宣告收藏電影列表 list, 從瀏覽器的 localStorage 取出資料
//   // 將localStorage 的字串資料轉成 JSON 物件資料
//   const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []

//   // 找出對應的電影 id, find 陣列方法
//   const movie = movies.find(movie => movie.id === id)


//   // 檢查是否已有存在相同的電影 id, some 陣列方法
//   if (list.some(movie => movie.id === id)) {
//     return alert('此電影已經在收藏清單中!')
//   }


//   // 將要蒐藏的電影裝進收藏電影列表
//   list.push(movie)
//   console.log(list)

//   // 把收藏電影資料列表 list, 放回瀏覽器的 localStorage 永久保存
//   // 將 JSON 物件資料轉回 JSON 字串資料才能放回 localStorage
//   localStorage.setItem('favoriteMovies', JSON.stringify(list))

// }


// 監聽點擊事件動態獲取 id 之觸發函式
function removeFromFavorite(id) {
  // 已從瀏覽器的 localStorage 取出資料為 movies
  

  // 這裡加上兩個條件控制：一旦傳入的 id 在收藏清單中不存在，或收藏清單是空的，就結束這個函式。
  if (!movies || !movies.length) return

  // 利用 findIndex 方法, 找到要刪除的電影, 該方法回傳位置
  const movieIndex = movies.findIndex( movie => movie.id === id )
  if (movieIndex === -1) return

  // 利用 splice 方法, 由 index 刪除1筆資料
  movies.splice( movieIndex, 1 )

  // 將修改完的電影資料存回 localStorage
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))

  // 重新渲染頁面
  renderMovieList(movies)
}









// 監聽點擊事件動態獲取 id
dataPanel.addEventListener('click', function onPanelclicked(event) {
  // 點擊跳出視窗按鈕
  if (event.target.matches('.btn-show-movie')) {
    console.log(event.target.dataset)
    showMovieModal(Number(event.target.dataset.id))
  } // 點擊蒐藏電影按鈕
  // else if (event.target.matches('.btn-add-favorite')) {
  //   console.log(event.target.dataset)
  //   addToFavorite(Number(event.target.dataset.id))
  // }
  else if (event.target.matches('.btn-remove-favorite')) {
    console.log(event.target.dataset)
    removeFromFavorite(Number(event.target.dataset.id))
  }

})



// // 監聽提交事件
// searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
//   event.preventDefault()
//   console.log('click!')  // 測試用


//   const keyword = searchInput.value.trim().toLowerCase()
//   console.log(keyword) // 測試用


//   if (!keyword.length) {
//     renderMovieList(movies)
//     return alert('Please enter a valid string.')
//   }

//   let filteredMovies = [] // 準備裝要篩選的電影

//   // // 對照關鍵字篩選電影: 方法一: for 迴圈
//   // for( const movie of movies ){
//   //   if (movie.title.toLowerCase().includes(keyword)){
//   //     filteredMovies.push( movie )
//   //   }
//   // }


//   // 對照關鍵字篩選電影: 方法二: filter 陣列方法
//   filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(keyword))



//   if (filteredMovies.length === 0) {
//     return alert('Cannot find a movie with keyword: ' + keyword)
//   }

//   // 再次觸發 renderMovieList, 重新渲染網頁
//   renderMovieList(filteredMovies)

// })





// axios.get(INDEX_URL)
//   .then(response => {
//     movies.push(...response.data.results)
//     // console.log(movies)
//     renderMovieList(movies)
//   })
//   .catch((err) => console.log(err))

// 呼叫收藏電影
renderMovieList( movies )