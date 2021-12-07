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

    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
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

    function doneAndDelete(item, itemName) {
        let isDone = false;
        let isDeleted = false;
        item.doneButton.addEventListener('click', function(){
            item.item.classList.toggle('list-group-item-success');
            isDone = !isDone;
            let objectItem = {
                name: itemName,
                done: isDone
            }
            localStorage.setItem(itemName, JSON.stringify(objectItem));//заменить done
        });

        item.deleteButton.addEventListener('click', function(){
            if (confirm('Вы уверены?')) {
                item.item.remove();
                isDeleted = !isDeleted;
                localStorage.removeItem(itemName);
            }
        });

        return {
            isDone,
            isDeleted
        };
    }

    function createTodoApp(container, title='Список дел', defaultTodos = [{
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
        let todoList = createTodoList();

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        for (let task of defaultTodos) { //вынести в отедльную функцию createItemFromObject -- использовать функцию при доставании из сторэдж
            let todoItemDefault = createTodoItem(task.name);
            if (task.done) {
                todoItemDefault.item.classList.add('list-group-item-success');
            }
            localStorage.setItem(task.name, JSON.stringify(task));
            doneAndDelete(todoItemDefault, task.name);
            todoList.append(todoItemDefault.item); //вынести в отдельную функцию вместе с дефолтным массивом
        }

        todoItemForm.form.addEventListener('input', function(){
           if(todoItemForm.input.value){
               todoItemForm.button.classList.remove('disabled');
           } else {todoItemForm.button.classList.add('disabled');} //вынести в отдельную функцию disableButton
        });

        todoItemForm.form.addEventListener('submit',function(e){
            e.preventDefault();

            //let todoItem = createTodoItem(todoItemForm.input.value);

           // doneAndDelete(todoItem);
/////////////////////////////////
            let todoItemObject = {
                name: todoItemForm.input.value,
                done: false
            };

            let todoItem = createTodoItem(todoItemObject.name);
            doneAndDelete(todoItem, todoItemObject.name);
            
            localStorage.setItem(todoItemObject.name, JSON.stringify(todoItemObject));

            

//////////////////////////////////////////
            todoList.append(todoItem.item);
            todoItemForm.input.value = '';
            todoItemForm.button.classList.add('disabled');
        });
    }

    window.createTodoApp = createTodoApp;


})();