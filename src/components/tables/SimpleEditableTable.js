import { useState } from "react";
import { Button, Col, Row, Table } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Toast from "@ilb/antd-toasts";
import schemaAdapter from "../../schemaAdapter.js";
import DefaultModal from "../modals/DefaultModal.js";
import SimpleTitle from "../titles/SimpleTitle.js";
import Access from "../Access.js";

/**
 * @param {object} - Объект с опциями.
 * @param {object} title - Заголовок.
 * @param {object} schema - Схема формы.
 * @param {string} title.text - Текст заголовка.
 * @param {object} table - Таблица.
 * @param {Array} table.rows - Строки таблицы.
 * @param {boolean} [table.withId=true] - Флаг включения идентификатора в таблицу (по умолчанию true).
 * @param {boolean} [table.withActions=true] - Флаг включения действий в таблицу (по умолчанию true).
 * @param {*} resource - Ресурс.
 * @param {*} [modalComponent=null] - Компонент модального окна
 */
const SimpleEditableTable = ({
  title = { text: "" },
  schema,
  table = { rows: [], withId: true, withActions: true },
  resource,
  modalComponent = null,
  access = ["create", "update", "delete"],
}) => {
  const ModalComponent = modalComponent || DefaultModal;
  const [tableData, setTableData] = useState(table.rows);
  const [isOpen, setOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState({});

  /**
   * Открытие модального окна для редактирования записи
   *
   * @param record
   */
  const edit = (record) => {
    setEditingRecord(record);
    setOpen(true);
  };

  /**
   * Открытие окна для создания новой записи
   */
  const create = () => {
    setEditingRecord({});
    setOpen(true);
  };

  /**
   * Удаление записи
   *
   * @param record
   * @returns {Promise<void>}
   */
  const remove = async (record) => {
    if (confirm(`Удалить запись ${record.name || record.title}?`)) {
      resource
        .delete(record.id)
        .then(() => {
          Toast.success();
          refresh();
        })
        .catch((err) => Toast.error(err.message));
    }
  };

  /**
   * Создание/Редактирование записи
   *
   * @param data
   * @returns {boolean} - корректно ли отработало сохранение
   */
  const store = (data) => {
    return resource
      .store({ id: editingRecord.id, ...data })
      .then(() => {
        Toast.success();
        setOpen(false);
        refresh();
        return true;
      })
      .catch((err) => {
        Toast.error(err.message);
        return false;
      });
  };

  /**
   * Обновление страницы
   */
  const refresh = () => {
    resource.getList().then(setTableData)
  };

  const haveEditableAccess = (access) => {
    let intersection = access.filter(x => ["update", "delete"].includes(x));

    return intersection.length > 0;
  };

  const preprocessSchema = (schema) => {
    schema = schemaAdapter(schema);

    let tableSchema = [];

    if (table.withId !== false) {
      const idColumn = {
        title: "#",
        dataIndex: "id",
        sorter: (a, b) => a.id - b.id,
      };

      tableSchema = [idColumn];
    }

    tableSchema = [...tableSchema, ...schema];

    if (table.withActions !== false && haveEditableAccess(access)) {
      const actionsColumn = {
        title: "Действия",
        width: 100,
        render: (record) => {
          return (
            <Row justify="end" gutter={[8, 8]}>
              <Access availables={access} needed="update">
                <Col>
                  <Button
                    onClick={() => edit(record)}
                    size="small"
                    type="primary"
                    shape="circle"
                    icon={<EditOutlined />}
                  />
                </Col>
              </Access>
              <Access availables={access} needed="delete">
                <Col>
                  <Button
                    onClick={() => remove(record)}
                    type="primary"
                    danger
                    size="small"
                    shape="circle"
                    icon={<DeleteOutlined />}
                  />
                </Col>
              </Access>
            </Row>
          );
        },
      };

      tableSchema = [...tableSchema, actionsColumn];
    }

    return tableSchema;
  };

  return (
    <>
      <Row gutter={[24, 16]}>
        <Col span={24}>
          <SimpleTitle text={title.text} access={access} create={create} />
        </Col>
        <Col span={24}>
          <Table columns={preprocessSchema(schema)} dataSource={tableData} />
        </Col>
      </Row>
      <ModalComponent
        record={editingRecord}
        isOpen={isOpen}
        hide={() => setOpen(false)}
        onSubmit={store}
        schema={schema}
      />
    </>
  );
};

export default SimpleEditableTable;
