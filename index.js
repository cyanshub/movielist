const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'

// 定義會用到的變數
let movies = []
let filteredMovies = [] // 準備裝要篩選的電影, 放在函式外面才不會被消滅
let page
const MOVIES_PER_PAGE = 12 // 一頁顯示4張卡片、3列
let flagRender = false //預設顯示卡片模式



// 選取 index.html 中的目標容器
const dataPanel = document.querySelector('#data-panel')
const dataPanelList = document.querySelector('#data-panel-list')

const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const btnRender = document.querySelector('#btn-render')


// 設計函式讀取 WEB API 的電影資料, 渲染網頁頁面
function renderMovieList(data){
  let rawHTML = ''
  let rawListHTML = ''
  
  // Processing data (使用 forEach 處理陣列資料)
  // item = 陣列裡面的個別元素
  data.forEach( (item) => {
    // console.log(item)
    // 需要 title, image

    // Render Movie List: Card Mode
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
              <button class="btn btn-info btn-add-favorite" data-id=${item.id}>+</button>

            </div>
          </div>
        </div>
      </div>
    `

    // Render Movie List: List Mode
    rawListHTML += `
    <li class="list-group-item">
        <div class="row justify-content-center align-items-center">
          <div class="col">
            ${item.title}
          </div>
          <div class="col-auto">
            <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
                data-bs-target="#movie-modal" data-id=${item.id}>More</button>
              <button class="btn btn-info btn-add-favorite" data-id=${item.id}>+</button>
          </div>    
        </div> 
      </li> 
    `
  })


  // 寫入選取的 HTML 容器中, 使用 flag 決定畫面渲染的模式
  if( flagRender ){
    dataPanel.innerHTML = rawHTML
    dataPanelList.innerHTML = ""
    dataPanelList.style = ""
  }else {
    dataPanel.innerHTML = ""
    dataPanelList.innerHTML = rawListHTML
    dataPanelList.style = "border-top: solid rgb(225,225,225) 1px"
  }

}



// 設計函式, 傳入頁碼顯示對應的電影卡片資料
function getMoviesByPage(page){
  // 假設外部已取得電影資料 movies
  // 用?判斷前面變數, 有值取左側, 無值取右側
  const data = filteredMovies.length ? filteredMovies : movies
  
  // 可使用 slice 函式處理電影資料 movies
  // page = 1 -> movies 0 ~ 11
  // page = 2 -> movies 12 ~ 23
  // page = 3 -> movies 24 ~ 35

  const startIndex = (page - 1) * MOVIES_PER_PAGE // .slice() 的作用起始點
  const endIndex = startIndex + MOVIES_PER_PAGE // .slice() 的終點(不參與作用)
  return data.slice(startIndex, endIndex)
}





// 設計函式, 依電影數量動態產生頁數
function renderPaginator(amount){
// movies = 84, MOVIES_PER_PAGE =12, numberOfPages 7
// movies = 85, MOVIES_PER_PAGE =12, numberOfPages 8
  const numberOfPages = Math.ceil(amount/ MOVIES_PER_PAGE)
  let rawHTML = ''
  for (i = 1; i <= numberOfPages; i++){
    rawHTML += `
    <li class="page-item"><a class="page-link" href="#" data-page=${i}>${i}</a></li>
    `
  }
  // 將處理完的 rawHTML 寫入選到的分頁器 paginator
  paginator.innerHTML = rawHTML
}




// 監聽點擊事件動態獲取 id 之觸發函式
function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get( INDEX_URL + id ).then( response => {
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


// 監聽點擊事件動態獲取 id 之觸發函式
function addToFavorite(id) {
  // 宣告收藏電影列表 list, 從瀏覽器的 localStorage 取出資料
  // 將localStorage 的字串資料轉成 JSON 物件資料
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  
  // 找出對應的電影 id, find 陣列方法
  const movie = movies.find( movie => movie.id === id )
  

  // 檢查是否已有存在相同的電影 id, some 陣列方法
  if( list.some( movie => movie.id === id ) ){
    return alert('此電影已經在收藏清單中!')
  }


  // 將要蒐藏的電影裝進收藏電影列表
  list.push(movie)
  console.log(list)

  // 把收藏電影資料列表 list, 放回瀏覽器的 localStorage 永久保存
  // 將 JSON 物件資料轉回 JSON 字串資料才能放回 localStorage
  localStorage.setItem('favoriteMovies', JSON.stringify(list))

}


// 監聽分頁器點擊事件, 動態獲取頁碼 page
paginator.addEventListener('click', function onPaginatorClicked(event){
  // 利用 tagName 確認點擊在頁碼上
  if( event.target.tagName !== 'A'  ) return
  page = Number( event.target.dataset.page )
  console.log(page) // 顯示點擊頁碼

  
  // 依點擊頁碼重新渲染網頁
  renderMovieList( getMoviesByPage(page) )
})



// 監聽點擊事件動態獲取 id => (1)卡片模式
dataPanel.addEventListener('click', function onPanelclicked(event){
  // 點擊跳出視窗按鈕
  if(event.target.matches('.btn-show-movie')){
    console.log(event.target.dataset)
    showMovieModal(Number(event.target.dataset.id))
  } // 點擊蒐藏電影按鈕
  else if (event.target.matches('.btn-add-favorite')){
    console.log(event.target.dataset)
    addToFavorite(Number(event.target.dataset.id))
  }
})

// 監聽點擊事件動態獲取 id => (2)列表模式
dataPanelList.addEventListener('click', function onPanelclicked(event) {
  // 點擊跳出視窗按鈕
  if (event.target.matches('.btn-show-movie')) {
    console.log(event.target.dataset)
    showMovieModal(Number(event.target.dataset.id))
  } // 點擊蒐藏電影按鈕
  else if (event.target.matches('.btn-add-favorite')) {
    console.log(event.target.dataset)
    addToFavorite(Number(event.target.dataset.id))
  }
})




// 監聽搜尋列提交事件: submit
searchForm.addEventListener('submit', function onSearchFormSubmitted(event){
  event.preventDefault()
  console.log('click!')  // 測試用
  
  const keyword = searchInput.value.trim().toLowerCase()
  console.log(keyword) // 測試用

  if(!keyword.length){
    filteredMovies = [] // 清空搜尋
    renderPaginator(movies.length) // 重置頁面
    renderMovieList(getMoviesByPage(page = 1)) // 重置頁面
    return alert('Please enter a valid string.')
  }
  

  // // 對照關鍵字篩選電影: 方法一: for 迴圈
  // for( const movie of movies ){
  //   if (movie.title.toLowerCase().includes(keyword)){
  //     filteredMovies.push( movie )
  //   }
  // }


   // 對照關鍵字篩選電影: 方法二: filter 陣列方法
   filteredMovies = movies.filter( movie => movie.title.toLowerCase().includes(keyword) )
   



  if( filteredMovies.length ===0 ){
    return alert('Cannot find a movie with keyword: ' + keyword)
  }

  // 再次觸發 renderMovieList, 重新渲染網頁
  renderMovieList(filteredMovies);
  renderPaginator(filteredMovies.length); // 依搜尋結果顯示正確頁數
  renderMovieList(getMoviesByPage((page = 1)));  // 搜尋功能也要加入分頁 => 依電影數量顯示對應的頁數 預設顯示第一頁


})


// 監聽點擊按鈕, 切換渲染模式
btnRender.addEventListener('click', function onBtnRenderClicked(event){
  if(event.target.matches(".btn-render-card")){
    flagRender = true
    console.log(flagRender)

    // 重新渲染頁面, 停留在當前頁面
    renderMovieList(getMoviesByPage(page))


  }else if(event.target.matches(".btn-render-list")){
    flagRender = false
    console.log(flagRender)
    
    // 重新渲染頁面, 停留在當前頁面
    renderMovieList(getMoviesByPage(page))

  }





})







axios.get(INDEX_URL)
.then( response => {
  movies.push(... response.data.results)
  // console.log(movies)
  // renderMovieList(movies)

  // 依電影數量顯示對應的頁數
  renderPaginator( movies.length )
  renderMovieList( getMoviesByPage(page = 1) ) // 預設顯示第1頁

})
.catch((err) => console.log(err))