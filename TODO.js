(function (){
    function createAppTitle(title){
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary', 'disabled');
        button.textContent = 'Добавить дело';

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button,
        };
    }

    function createTodoList(listKey) {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        list.setAttribute('id', listKey);
        return list;
    }

    function createTodoItem(name) {
        let item = document.createElement('li');

        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = name;

        buttonGroup.classList.add('btn-group', 'button-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        return {
            item,
            doneButton,
            deleteButton,
        };
    }

    function doneAndDelete(item, itemName, isDone) {
        item.doneButton.addEventListener('click', function(){
            item.item.classList.toggle('list-group-item-success');
            isDone = !isDone;
            localStorage.setItem(itemName, isDone);
        });

        item.deleteButton.addEventListener('click', function(){
            if (confirm('Вы уверены?')) {
                item.item.remove();
                localStorage.removeItem(itemName);
            }
        });
    }
    
    function isPageRefreshed() {
        return false;
    }

    function createTodoApp(container, title='Список дел', listKey, defaultTodos = [{
        name: 'Обнять Бри',
        done: true
    },

        {
            name: 'Съесть булочку',
            done: true
        },

        {
            name: 'Купить миникупер',
            done: false
        }]){

        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList(listKey);

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        for (let task of defaultTodos) {
            if (isPageRefreshed()){
                localStorage.setItem(JSON.stringify[task.name, listKey], JSON.stringify(task.done));
            }
        }

        for (let i = 0; i < localStorage.length; i++) { //выгрузка заданий из localStorage
            let key = localStorage.key(i);
            let value = JSON.parse(localStorage.getItem(key));
            let todoItem = createTodoItem(JSON.parse(key)[0]);
            if (value) {
                todoItem.item.classList.add('list-group-item-success');
            } else {todoItem.item.classList.remove('list-group-item-success')};
            doneAndDelete(todoItem, key, value);
            if (JSON.parse(key)[1] === todoList.id) {
                todoList.append(todoItem.item);
            }
        }

        todoItemForm.form.addEventListener('input', function(){ //отключение и включение кнопки ввести дело если поле пустое
           if(todoItemForm.input.value){
               todoItemForm.button.classList.remove('disabled');
           } else {todoItemForm.button.classList.add('disabled');} 
        });

        todoItemForm.form.addEventListener('submit',function(e){
            e.preventDefault();

            let todoItemName = todoItemForm.input.value;
            let todoItem = createTodoItem(todoItemName);

            todoItem.item.setAttribute('id', listKey);

            localStorage.setItem(JSON.stringify([todoItemName, listKey]), false);
            doneAndDelete(todoItem, todoItemName, false);


            
            if (todoItem.item.id === todoList.id) {
                todoList.append(todoItem.item);
            }
            todoItemForm.input.value = '';
            todoItemForm.button.classList.add('disabled');
        });
    }

    window.createTodoApp = createTodoApp;
    window.onbeforeunload = isPageRefreshed();
})();