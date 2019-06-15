$(document).ready(() => {
  let currentPage = 1;
  let todos = [];
  let filter = 'all';

  const { _ } = window;
  const TODOS_ON_PAGE = 5;
  const KEY_ENTER = 13;
  const $todosList = $('#todos-list');
  const $todosInput = $('#todos-input');
  const $notification = $('#notification');
  const $pagination = $('#pagination');
  const $checkedAll = $('#checked-all');
  const $todoAdd = $('#todo-add');
  const $all = $('#all');
  const $active = $('#active');
  const $completed = $('#completed');
  const $deleteCompleted = $('#delete-completed');

  const filtration = function() {
    let filterTodos = [];

    if (filter === 'active') {
      filterTodos = todos.filter(todo => todo.checked === false);
    }
    if (filter === 'completed') {
      filterTodos = todos.filter(todo => todo.checked === true);
    }
    if (filter === 'all') {
      filterTodos = todos;
    }

    return filterTodos;
  };

  const getLastPage = function() {
    return Math.ceil(filtration().length / TODOS_ON_PAGE);
  };

  const callCurrentPage = function() {
    const firstCondition = filtration().length % TODOS_ON_PAGE === 0;
    const lastPage = getLastPage();

    if (firstCondition && Number(currentPage) > Number(lastPage)) {
      currentPage = lastPage;
    }
  };

  const displayNotificationIfTodosEmpty = function() {
    if (todos.length) {
      $notification.css('display', 'none');
    }
  };

  $(document).on('keypress', event => {
    if (event.which === KEY_ENTER) {
      $todoAdd.click();
    }
  });

  $todosList.on('keypress', '.edit-input', event => {
    if (event.which === KEY_ENTER) {
      $('input:focus').focusout();
    }
  });

  const checkInput = function(value) {
    if (!value) {
      return true;
    }

    return false;
  };

  const countOnPages = function() {
    const allTodos = currentPage * TODOS_ON_PAGE;
    const firstPage = allTodos - TODOS_ON_PAGE;
    const lastPage = firstPage + TODOS_ON_PAGE;
    const filterTodo = filtration();

    return filterTodo.slice(firstPage, lastPage);
  };

  const paginationControl = function() {
    $pagination.empty();
    const numPages = getLastPage();

    let stringLi = '';

    for (let i = 1; i <= numPages; i++) {
      const activeCurrentPage = Number(currentPage) === i ? 'active' : '';

      stringLi += `
        <li id="li-page-${i}" class="page-item ${activeCurrentPage}">
        <a id="a-page-${i}" class="page-link">${i}</a>
        </li>`;
    }

    const numPage = Number(currentPage);
    const disablePrevious = numPage > 1 ? '' : 'disabled';
    const disableNext = numPage === Number(numPages) ? 'disabled' : '';

    const stringPagination = `
      <li id="page-previous" class="page-item ${disablePrevious}">
      <a class="page-link" tabindex="-1" aria-disabled="true">Previous</a>
      </li>
      ${stringLi}
      <li id="page-next" class="page-item ${disableNext}">
      <a class="page-link">Next</a>
      </li>`;

    $pagination.append(stringPagination);
  };

  const render = function() {
    $todosList.empty();
    $checkedAll.prop('checked', false);
    const filterTodos = countOnPages();

    let stringForRender = '';

    filterTodos.forEach(todo => {
      const notEdit = !todo.edit;
      const checked = todo.checked ? 'text-decoration-line' : '';
      const classEdit = 'edit-input-';
      const showEdit = todo.edit ? `${classEdit}show` : `${classEdit}hide`;
      const todoValue = todo.edit ? '' : `${todo.value}`;
      const hideObjects = notEdit ? ' ' : `${classEdit}hide`;
      const autofocus = todo.edit ? 'autofocus' : '';

      stringForRender += `<li 
        id="${todo.id}" class="list-group-item ${checked}">
        <input type="text" 
        id="edit-input-${todo.id}" 
        class="edit-input ${showEdit}"
        value="${todo.value}"
        ${autofocus}/>
        <input id="${todo.id}" ${todo.checked ? 'checked' : ''} 
        class="${hideObjects}" type="checkbox"/>${todoValue}
        <button id="${todo.id}" name="delete" 
        class="delete btn btn-danger ${hideObjects}">x</button>
        </li>`;

      const statusCheckedAll = todos.every(element => element.checked === true);

      $checkedAll.prop('checked', statusCheckedAll);
    });

    $todosList.append(stringForRender);

    if (todos.length > 0) {
      const completeTodo = todos.filter(el => el.checked === true);
      const activeTodo = todos.length - completeTodo.length;

      $todosList.append(`</br>
                         <div class="bg-warning">Сomplete:${completeTodo.length}
                         \n Active:${activeTodo} 
                         </div>`);
    }
    paginationControl();
  };

  const activeFilter = function() {
    filter = $(this).attr('id');
    currentPage = getLastPage();
    $('#filter > input').removeClass('active');
    $(this).addClass('active');
    render();
  };

  $all.click(activeFilter);
  $active.click(activeFilter);
  $completed.click(activeFilter);

  const add = function() {
    const value = _.escape($todosInput.val().trim());

    if (!value || checkInput(value) === true) {
      $todosInput.val('');

      return false;
    }

    const todo = {};

    todo.id = Math.random();
    todo.value = value;
    todo.checked = false;
    todo.edit = false;

    todos.push(todo);
    currentPage = getLastPage();

    $todosInput.val('');
    displayNotificationIfTodosEmpty();
    render();

    return $todosInput.val('');
  };

  $todoAdd.on('click', add);

  $todosList.on('click', 'input[type=checkbox]', event => {
    const clickId = Number($(event.currentTarget).attr('id'));

    todos.forEach(todo => {
      if (todo.id === clickId) {
        todo.checked = !todo.checked;
      }
    });
    callCurrentPage();
    render();
  });

  $checkedAll.on('click', event => {
    const generalStatus = $(event.currentTarget).is(':checked');

    todos.forEach(todo => {
      todo.checked = generalStatus;
    });
    currentPage = getLastPage();
    render();
  });

  $todosList.on('click', 'button[name=delete]', event => {
    const clickId = Number($(event.currentTarget).attr('id'));

    todos = todos.filter(todo => todo.id !== clickId);
    callCurrentPage();
    render();
  });

  $($deleteCompleted).click(() => {
    todos = todos.filter(todo => todo.checked === false);
    callCurrentPage();
    render();
  });

  $todosList.on('dblclick', 'li', event => {
    const clickId = Number($(event.currentTarget).attr('id'));

    $(`li[id="edit-input-${clickId}"]`).focus();

    todos.forEach(todo => {
      if (todo.id === clickId) {
        todo.edit = true;
      }
    });
    render();
  });

  $todosList.on('blur', '.edit-input', event => {
    let clickId = $(event.currentTarget).parent();

    const newValue = _.escape($(event.currentTarget).val()).trim();

    clickId = Number(clickId.attr('id'));
    const value = newValue;

    if (newValue || checkInput(value) === false) {
      todos.forEach(todo => {
        if (todo.id === clickId) {
          todo.value = newValue;
          todo.edit = false;
        }
      });
      render();
    } else {
      $(event.currentTarget).focus();
    }
  });

  const pageNextClick = function() {
    if (currentPage < getLastPage()) {
      ++currentPage;
    }
    render();
  };

  const pagePreviousClick = function() {
    if (Number(currentPage) > 1) {
      --currentPage;
    }
    render();
  };

  $pagination.on('click', `li[id^='li-page-']`, event => {
    currentPage = $(event.currentTarget).children();

    currentPage = currentPage.text();
    render();
  });

  $pagination.on('click', '#page-next', pageNextClick);
  $pagination.on('click', '#page-previous', pagePreviousClick);
});
