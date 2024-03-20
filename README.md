# antd-tables

Библиотека для упрощения создания таблиц с CRUD-действиями

Пример:

```js
// schema - ajv-схема для формы создания/редактирования записи. + На основе нее формируются колонки таблицы
const schema = {
  type: "object",
  properties: {
    name: {
      title: "Название",
      type: "string",
    },
    code: {
      title: "Код",
      type: "string",
    },
  },
  required: ["name", "code"],
};

// resource - обьект с функциями getList, create, update и delete
const resource = {
  getList: () => {
    // получение списка записей
    return [
      {
        id: 1,
        name: "Создано",
        code: "CREATED"
      },
      {
        id: 2,
        name: "Завершено",
        code: "COMPLETED"
      },
    ]
  },
  create: () => {
    // создание записи 
  },
  update: () => {
    // изменение записи
  },
  delete: () => {
    // удаление записи
  },
};

// config - параметры таблицы
// config.title - текст заголовка таблицы
// config.withId - отображать ли в таблице id записи

// access - массив с параметрами доступа: 
//  * create - можно добавлять записи
//  * update - можно редактировать записи
//  * delete - можно удалять записи

<SimpleEditableTable
  schema={schema}
  resource={resource}
  config={{ title: "Статусы", withId: true }}
  access={["create", "update", "delete"]}
/>;
```
