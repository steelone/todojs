// $(function (){
$(document).ready(() => {

    let array=[];
    const TASKS_ON_PAGE = 3;
    const KEY_ENTER = 13;
    const $tasksList = $("#tasks-list");
    const $tasksInput = $("#tasks-input");
    const $notification = $("#notification");
    const $pagination = $("#pagination");
    const $pageLink = $(".page-link");
    let currentPage = 1;
    const $checkedAll = $('#checked-all');
    const $all = $('#all');
    const $active = $('#active');
    const $completed = $('#completed');
    const $deleteCompleted = $('#delete-completed');
    let filter = 'all';
    
    const callCurrentPage = function() {
        return Math.ceil(filtration().length / TASKS_ON_PAGE);
    }

    // Message: Task list is empty
    const displayNotification = function() {
        if (array.length) {
            $notification.css("display", "none");
        }
    };
    
    // KeyPress ENTER
    $(document).on('keypress', function(e) {
        if(e.which === KEY_ENTER){//Enter key pressed
            $('#task-add').click();//Trigger search button click event
        }
    });
    // Accept edit by key 'Enter'
    // $tasksList.on('keypress', '.editInput', function(e) {
    $tasksList.on('keypress', '.edit-input', event => {
        if (event.which === KEY_ENTER) {
            // alert('SAVE!');
            // console.log($(event.currentTarget));
            $(event.currentTarget).blur();
            
            // $("input:focus").blur();
            
            // $("input:focus").focusout();
            // $tasksList.on('blur');
            // blur();
        }
    });

    // Check your input data
    const checkInput = function(value){
        let empty=+value;
        if(empty == 0) {
            // alert('Incorrect data');
            return true;
        } else {return false;}
    };
   
    // Filtration by checked
    const filtration = function() {
        let filterArray = [];

        if (filter == 'active') {
            filterArray = array.filter(task => task.checked === false);
        }
        if (filter == 'completed') {
            filterArray = array.filter(task => task.checked === true);
        }
        if (filter == 'all') {
            filterArray = array;
        }
        return filterArray;
    };
    
    $all.click(event => {
        filter = 'all';
        currentPage = callCurrentPage();
        render();
    })
    
    $active.click(event => {
        filter = 'active';
        currentPage = callCurrentPage();
        render();
    })

    $completed.click(event => {
        filter = 'completed';
        currentPage = callCurrentPage();
        render();
    })

    // On pages
    const CountOnPages = function() {
        const allTask = currentPage * TASKS_ON_PAGE;
        const firstPage = allTask - TASKS_ON_PAGE;
        const lastPage = firstPage + TASKS_ON_PAGE;
        const filterTask = filtration();
        
        return filterTask.slice(firstPage, lastPage);
    };

    // RENDER
    const render = function() {
        $tasksList.empty();
        $checkedAll.prop('checked', false);
        const filterTasks = CountOnPages();
        let stringForRender = '';
        
        filterTasks.forEach(task => {
            let decor = (task.checked === true) ? 'text-decoration-line':'';
            let decorEdit = (task.edit === true) ? ' edit-input-show':' edit-input-hide';
            let value = (task.edit === true) ? '' : `${task.value}`;
            let decorEditOther = (task.edit === false) ? ' ' : ' edit-input-hide';
            let autofocus = (task.edit === true) ? 'autofocus' : '';
            stringForRender += `<li id="${task.id}" class="list-group-item ${decor}">
                                <input type="text" id="edit-input-${task.id}" class="edit-input ${decorEdit}" value="${task.value}" ${autofocus}/>
                                <input id="${task.id}" ${task.checked ? 'checked' : ''} class="${decorEditOther}" type="checkbox"/>${value}
                                <button id="${task.id}" name="delete" class="delete btn btn-danger${decorEditOther}">x</button>
                                </li>`;

        // Change checkbox for all tasks
        const statusCheckedAll = array.every(element => element.checked === true);

        $checkedAll.prop('checked', statusCheckedAll);
        });
        $tasksList.append(stringForRender);

        // Counter active & complete tasks
        const completeTask = (array.filter(el => el.checked === true)).length;
        const activeTask = array.length - completeTask;
        
        if (array.length > 0) {
            $tasksList.append(`</br><div class="bg-warning">Сomplete:${completeTask} 
                                \n Active:${activeTask} </div>`);
          }
        addNewPage();
        console.log( array );
    };

    // Add task
    $("#task-add").on("click", function(){
        const value = _.escape($tasksInput.val().trim());
        // checkInput(value);
        
        if(!value || checkInput(value) === true) {
            $tasksInput.val("");
            return false;
        }
        
        const task = {};
        const uniq = Math.floor((Math.random() * 10000) + 1);
        
        task.id = uniq;
        task.value = value;
        task.checked = false;
        task.edit = false;

        array.push(task);
        currentPage = callCurrentPage();

        $tasksInput.val("");
        displayNotification();
        render();
    });

    // Change checkbox for current task
    $tasksList.on('click', 'input[type=checkbox]', event => {
        const clickId = Number($(event.currentTarget).attr('id'));

        array.forEach(task => {
        if (task.id === clickId) {
            task.checked = !task.checked;
        }
        });
        // currentPage = callCurrentPage();
        render();
    });
  
    // Change checkbox for all tasks
    $checkedAll.on('click', event => {
        const generalStatus = $(event.currentTarget).is(':checked');

        array.forEach(task => {
            task.checked = generalStatus;
        });
        currentPage = callCurrentPage();
        render();
    });

    // Delete
    $tasksList.on('click', 'button[name=delete]', event => {
        const clickId = Number($(event.currentTarget).attr('id'));

        let delConfirm = confirm("Are you sure?");
        if (delConfirm){
            array = array.filter(task => task.id != clickId);
            currentPage = callCurrentPage();
            render();
        }
        
    })
    
    // Delete all completed
    $($deleteCompleted).click(() => {
        array = array.filter(task => task.checked === false);
        currentPage = callCurrentPage();
        render();
    });

    // DoubleClick for change value
    $tasksList.on('dblclick', 'li', event => {
        const clickId = Number($(event.currentTarget).attr('id'));
        
        // const $editInput = $('#editInput');
        // $("li[id^='edit-input-']").focus();
        $('li[id="edit-input-'+clickId+'"]').focus();

        array.forEach(task => {
        if (task.id === clickId) {
            task.edit = true;
        }
        });
        render();
    });

    // Blur for change value
    $tasksList.on('blur', '.edit-input', event => {
        const clickId = Number($(event.currentTarget).parent().attr('id'));
        const newValue = _.escape($(event.currentTarget).val().trim());
        // console.log($(event.currentTarget).parent());
        // console.log(newValue);
        let value = newValue;
        if(newValue || checkInput(value) === false) {
            array.forEach(task => {
            if (task.id === clickId) {
                task.value = newValue;
                task.edit = false;
            }
            });
            render();
        } else {$(event.currentTarget).focus()}
    });

    // $( "#target" ).click(function() {
    //     alert( "Handler for .click() called." );
    // });

    // Change current page
    // let currentPageClick = function (){}
    // $pagination.on("click", '.page-item', currentPageClick)
    $pagination.on("click", '#page-next', event => {
        if ( currentPage < Math.ceil(filtration().length / TASKS_ON_PAGE) ) {
            ++currentPage;
        }
        render();
        console.log(currentPage);
    });
    $pagination.on("click", '#page-previous', event => {
        if ( +currentPage > 1 ) {
            --currentPage;
        }
        render();
        console.log(currentPage);
    });

    $pagination.on("click", "li[id^='li-page-']", event => {
        currentPage = $(event.currentTarget).children().text();
        console.log(currentPage);
        render();
    });
    
    // Pagination
    const addNewPage = function() {
        $pagination.empty();
        const condition = Math.ceil(filtration().length / TASKS_ON_PAGE);
        let stringPagination = '';
        let stringLi = '';
        
        for (let i = 1; i <= condition ; i++){
            let activeCurrentPage = (+currentPage === i) ? "" : "active";
            stringLi += `
            <li id="li-page-${i}" class="page-item ${activeCurrentPage}">
                <a id="a-page-${i}" class="page-link">${i}</a>
            </li>`;
        }
        let disablePrevious = (+currentPage > 1) ? "" : "disabled";
        let disableNext = (+currentPage === +condition) ? "disabled" : "";
        
        stringPagination = `        
        <li id="page-previous" class="page-item ${disablePrevious}">
            <a class="page-link" tabindex="-1" aria-disabled="true">Previous</a>
        </li>
        ${stringLi}
        <li id="page-next" class="page-item ${disableNext}">
            <a class="page-link">Next</a>
        </li>`;
        
        $pagination.append(stringPagination);
        
        // <li class="page-item disabled">
        //     <a class="page-link" href="javascript:void(0)" tabindex="-1" aria-disabled="true">Previous</a>
        // </li>
        // <li class="page-item"><a class="page-link" href="javascript:void(0)">1</a></li>
        // <li class="page-item">
        //     <a class="page-link" href="javascript:void(0)">Next</a>
        // </li>

    };

})
