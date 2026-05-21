const addBtn = document.getElementById('addBtn')

const taskInput = document.getElementById('taskInput')

const dateInput = document.getElementById('dateInput')

const categoryInput = document.getElementById('categoryInput')

const priorityInput = document.getElementById('priorityInput')

const taskList = document.getElementById('taskList')

const searchInput = document.getElementById('searchInput')

const taskStats = document.getElementById('taskStats')

const todayTask = document.getElementById('todayTask')

const progressSummary = document.getElementById('progressSummary')

const darkModeBtn = document.getElementById('darkModeBtn')

const messageBox = document.getElementById('messageBox')

const menuItems = document.querySelectorAll('.menu-item')

let currentCategory = '전체'

let tasks = []

const messages = [
  '🔥 이번엔 미루지 말자!',
  '📖 미래의 당신이 고마워합니다.',
  '🚀 A+ 가보자!',
  '💪 조금만 더 힘내자!',
]

loadTasks()

addBtn.addEventListener('click', addTask)

searchInput.addEventListener('input', renderTasks)

darkModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark')
})

menuItems.forEach((item) => {
  item.addEventListener('click', () => {
    menuItems.forEach((i) => i.classList.remove('active'))

    item.classList.add('active')

    currentCategory = item.dataset.category

    renderTasks()
  })
})

function addTask() {
  const taskName = taskInput.value.trim()

  const taskDate = dateInput.value

  const category = categoryInput.value

  const priority = priorityInput.value

  if (taskName === '' || taskDate === '') {
    alert('과제 이름과 날짜를 입력하세요!')

    return
  }

  const task = {
    id: Date.now(),

    name: taskName,

    date: taskDate,

    category,

    priority,

    completed: false,

    progress: 0,
  }

  tasks.push(task)

  const randomMessage = messages[Math.floor(Math.random() * messages.length)]

  messageBox.textContent = randomMessage

  saveTasks()

  renderTasks()

  taskInput.value = ''
  dateInput.value = ''
}

function renderTasks() {
  taskList.innerHTML = ''

  const keyword = searchInput.value.toLowerCase()

  let filteredTasks = tasks.filter((task) => {
    const matchSearch = task.name.toLowerCase().includes(keyword)

    const matchCategory =
      currentCategory === '전체' || task.category === currentCategory

    return matchSearch && matchCategory
  })

  if (filteredTasks.length === 0) {
    taskList.innerHTML = `
      <div class="empty-state">
        <h2>
          📭 아직 등록된 과제가 없습니다.
        </h2>

        <p>
          새 과제를 추가해보세요!
        </p>
      </div>
    `
  }

  filteredTasks.sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed - b.completed
    }

    return new Date(a.date) - new Date(b.date)
  })

  let completedCount = 0
  let todayCount = 0

  filteredTasks.forEach((task) => {
    if (task.completed) {
      completedCount++
    }

    const taskDiv = document.createElement('div')

    taskDiv.classList.add('task')

    if (task.category === '전공') {
      taskDiv.classList.add('major')
    } else if (task.category === '교양') {
      taskDiv.classList.add('liberal')
    } else if (task.category === '팀플') {
      taskDiv.classList.add('team')
    } else if (task.category === '시험') {
      taskDiv.classList.add('exam')
    }

    const title = document.createElement('h2')

    title.textContent = task.name

    const categoryText = document.createElement('p')

    categoryText.textContent = `📂 카테고리: ${task.category}`

    const priorityText = document.createElement('p')

    priorityText.textContent = `⭐ 중요도: ${task.priority}`

    if (task.priority === '매우 중요') {
      priorityText.classList.add('priority-high')
    }

    const countdown = document.createElement('p')

    function updateCountdown() {
      const now = new Date()

      const deadline = new Date(task.date)

      const diff = deadline - now

      if (diff <= 0) {
        countdown.textContent = '⛔ 마감되었습니다!'

        taskDiv.classList.add('danger')

        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)

      const minutes = Math.floor((diff / (1000 * 60)) % 60)

      const seconds = Math.floor((diff / 1000) % 60)

      countdown.textContent = `⏰ ${days}일 ${hours}시간 ${minutes}분 ${seconds}초 남음`

      if (days >= 7) {
        taskDiv.classList.add('safe')
      } else if (days >= 3) {
        taskDiv.classList.add('warning')
      } else {
        taskDiv.classList.add('danger')
      }

      if (days === 0) {
        taskDiv.classList.add('shake')

        todayCount++
      }
    }

    updateCountdown()

    setInterval(updateCountdown, 1000)

    const progressText = document.createElement('p')

    progressText.textContent = `📈 진행도: ${task.progress}%`

    const progressBar = document.createElement('div')

    progressBar.classList.add('progress-bar')

    const progress = document.createElement('div')

    progress.classList.add('progress')

    progress.style.width = `${task.progress}%`

    progressBar.appendChild(progress)

    const slider = document.createElement('input')

    slider.type = 'range'

    slider.min = 0

    slider.max = 100

    slider.value = task.progress

    slider.classList.add('slider')

    slider.addEventListener('input', () => {
      task.progress = slider.value

      progress.style.width = `${task.progress}%`

      progressText.textContent = `📈 진행도: ${task.progress}%`

      saveTasks()
    })

    const btnBox = document.createElement('div')

    btnBox.classList.add('btn-box')

    const completeBtn = document.createElement('button')

    completeBtn.textContent = '완료'

    completeBtn.classList.add('complete-btn')

    const deleteBtn = document.createElement('button')

    deleteBtn.textContent = '삭제'

    deleteBtn.classList.add('delete-btn')

    btnBox.appendChild(completeBtn)

    btnBox.appendChild(deleteBtn)

    completeBtn.addEventListener('click', () => {
      task.completed = !task.completed

      saveTasks()

      renderTasks()
    })

    if (task.completed) {
      taskDiv.classList.add('completed')
    }

    deleteBtn.addEventListener('click', () => {
      tasks = tasks.filter((t) => t.id !== task.id)

      saveTasks()

      renderTasks()
    })

    taskDiv.appendChild(title)

    taskDiv.appendChild(categoryText)

    taskDiv.appendChild(priorityText)

    taskDiv.appendChild(countdown)

    taskDiv.appendChild(progressText)

    taskDiv.appendChild(progressBar)

    taskDiv.appendChild(slider)

    taskDiv.appendChild(btnBox)

    taskList.appendChild(taskDiv)
  })

  taskStats.textContent = `완료: ${completedCount}개 / 전체: ${tasks.length}개`

  if (todayCount > 0) {
    todayTask.textContent = `🔥 오늘 마감 과제 ${todayCount}개`
  } else {
    todayTask.textContent = '🔥 오늘 마감 과제 없음'
  }

  const totalProgress = tasks.reduce(
    (sum, task) => sum + Number(task.progress),
    0,
  )

  const averageProgress =
    tasks.length > 0 ? Math.floor(totalProgress / tasks.length) : 0

  progressSummary.textContent = `📈 평균 진행률: ${averageProgress}%`
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

function loadTasks() {
  const saved = localStorage.getItem('tasks')

  if (saved) {
    tasks = JSON.parse(saved)
  }

  renderTasks()
}
