const scoreboardUl = document.getElementById('score__board_id')
const scoreboardType = document.getElementById('score__board_type')
const boardSizeElement = document.getElementById('boardSize')
getScoreboard(boardSizeElement.value)

export function getScoreboard(type) {
  scoreboardType.textContent = type
  let child = scoreboardUl.lastElementChild;
  while (child) {
    scoreboardUl.removeChild(child);
    child = scoreboardUl.lastElementChild;
  }
  fetch(`http://localhost:3000/scoreboard/${type}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => {
    return res.json()
  })
    .then(resData => {
      resData.map(el => {
        const li = document.createElement('li')
        const span1 = document.createElement('span')
        const span2 = document.createElement('span')
        const hr = document.createElement('HR')
        span1.textContent = el.name
        span2.textContent = el.record + 's'
        li.append(span1)
        li.append(span2)
        scoreboardUl.append(li)
        scoreboardUl.append(hr)
      })
    })
    .catch(err => {
      console.log(err)
    })

}

export function saveScore(params) {
  fetch(`http://localhost:3000/scoreboard`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => {
    getScoreboard(params.level)
  }).catch(err => {
    console.log(err)
  })

}
