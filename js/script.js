let allPersons = [];
let tabPerson = null;
let tabInfo = null;
let buttonSearch = null;
let inputName = null;
let numberFormat = null;

window.addEventListener('load', () => {
  tabPerson = document.querySelector('.people');
  tabInfo = document.querySelector('.statistics');
  buttonSearch = document.querySelector('.btn');
  inputName = document.getElementById('name');

  numberFormat = Intl.NumberFormat('pt-BR');

  fetchPersons();
});

async function fetchPersons() {
  const res = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );
  const json = await res.json();

  allPersons = json.results.map((person) => {
    const { name, picture, dob, gender } = person;
    return {
      name: name.first,
      lastname: name.last,
      photo: picture.large,
      age: dob.age,
      gender,
    };
  });
  render();
}

function render() {
  clearAndFocusInput();
  preventSubmit();
  renderStatistics();
}

function preventSubmit() {
  function handlePreventSubmit(event) {
    event.preventDefault();
  }
  let form = document.querySelector('.form');
  form.addEventListener('submit', handlePreventSubmit);
  inputName.addEventListener('keyup', handleTyping);
  buttonSearch.addEventListener('click', clickSearch);
  inputName.focus();
}

function handleTyping(event) {
  if (event.target.value == '' || event.target.value.trim() == '') {
    tabPerson.innerHTML = '';
    let totalUsers = document.querySelector('.total-users');
    totalUsers.textContent = 'Waiting for search';
    clearInfo();
    return;
  }
  let nameInput = event.target.value;

  findName = findPerson(nameInput);

  renderPersonList(
    findName.sort((a, b) => {
      return a.name.localeCompare(b.name);
    })
  );
}

function clearInfo() {
  tabInfo.innerHTML = '';
  let usersInfo = document.querySelector('.statistics-info');
  usersInfo.textContent = 'Waiting for search';
}

function findPerson(nameInput) {
  return allPersons.filter((person) => {
    const { name } = person;
    return name.toLowerCase().indexOf(nameInput.toLowerCase()) >= 0;
  });
}

function renderPersonList(findName) {
  let humanHTML = '<div>';

  findName.forEach((person) => {
    const { name, lastname, photo, age, gender } = person;
    const personHTML = `
      <div class='person'>
        <div>
          <img src="${photo}" alt="${name}">
        </div>
        <div>
          <ul>
            <li>${name} ${lastname}, ${age} anos</li>
          </ul>
        </div>
      </div>`;
    humanHTML += personHTML;
  });

  renderStatistics(findName);
  let totalUsers = document.querySelector('.total-users');
  totalUsers.textContent = `${findName.length} user(s) found`;
  humanHTML += '</div>';
  tabPerson.innerHTML = humanHTML;
}

function renderStatistics(persons) {
  if (persons == null) {
    return;
  }
  let totalFemale = 0;
  let totalMale = 0;
  let totalAges = 0;
  persons.forEach((person) => {
    const { age, gender } = person;
    if (person.gender === 'female') {
      totalFemale += 1;
    } else {
      totalMale += 1;
    }
    totalAges += person.age;
  });

  const statisticsHTML = `
      <div class='info'>
        <p>Female: ${totalFemale}</p>
        <p>Male: ${totalMale}</p>
        <p>Total ages: ${formatNumber(totalAges)}</p>
        <p>Media ages: ${formatNumber(totalAges / persons.length)}</p>
      </div>`;

  let usersInfo = document.querySelector('.statistics-info');
  usersInfo.textContent = 'Statistics';
  tabInfo.innerHTML = statisticsHTML;
}

function clickSearch() {
  inputName = document.querySelector('#name');
  let nameValue = inputName.value;
  console.log(nameValue);
  if (nameValue == '' || nameValue.trim() == '') {
    inputName.focus();
    return;
  }
  nameValue = findPerson(nameValue);
  renderPersonList(
    nameValue.sort((a, b) => {
      return a.name.localeCompare(b.name);
    })
  );
}

function clearAndFocusInput() {
  inputName.value = '';
  inputName.focus();
}

function formatNumber(number) {
  return numberFormat.format(number);
}
