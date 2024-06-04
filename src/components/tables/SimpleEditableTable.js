import { useEffect, useState } from "react";
import { Button, Col, Row, Table } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Toast from "@ilb/antd-toasts";
import schemaAdapter from "../../schemaAdapter.js";
import DefaultModal from "../modals/DefaultModal.js";
import SimpleTitle from "../titles/SimpleTitle.js";
import Access from "../Access.js";
import IsArchiveToggle from "../other/IsArchiveToggle.mjs";

/**
 * @param {object} - Объект с опциями.
 * @param {object} schema - Схема формы.
 * @param {boolean} config.withId - Флаг включения идентификатора в таблицу
 * @param {boolean} config.title - Текст заголовка таблицы.
 * @param {boolean} config.archivable - Флаг, указывающий, что записи могут быть архивными.
 * @param {*} resource - Ресурс.
 * @param {*} [modalComponent=null] - Компонент модального окна
 */
const SimpleEditableTable = ({
  schema,
  config = {},
  resource,
  modalComponent = null,
  access = ["create", "update", "delete"],
}) => {
  const ModalComponent = modalComponent || DefaultModal;
  const [tableData, setTableData] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState({});

  useEffect(() => {
    refresh();
  }, []);

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

  const successCallback = () => {
    Toast.success();
    refresh();
    return true;
  }

  const errorCallback = (err) => {
    Toast.error(err.message);
    return false;
  }

  const hideModal = () => {
    setOpen(false);
  }

  /**
   * Создание/Редактирование записи
   *
   * @param data
   */
  const store = (data) => {
    if (editingRecord.id) {
      return resource.update(editingRecord.id, data).then(successCallback).catch(errorCallback).finally(hideModal)
    } else {
      return resource.create(data).then(successCallback).catch(errorCallback).finally(hideModal)
    }
  };

  /**
   *
   * @param {object} record
   * @param {int} record.id
   * @returns {Promise<void>}
   */
  const archive = async (record) => {
    if (confirm(`Отправить "${record.title || record.name}" в архив?`)) {
      return resource.archive(record.id).then(successCallback).catch(errorCallback);
    }
  };

  /**
   *
   * @param {object} record
   * @param {int} record.id
   * @returns {Promise<*>}
   */
  const restore = async (record) => {
    if (confirm(`Восстановить "${record.title || record.name}" из архива?`)) {
      return resource.restore(record.id).then(successCallback).catch(errorCallback);
    }
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

    if (config.withId !== false) {
      const idColumn = {
        title: "#",
        dataIndex: "id",
        sorter: (a, b) => a.id - b.id,
      };

      tableSchema = [idColumn];
    }

    tableSchema = [...tableSchema, ...schema];

    if (haveEditableAccess(access)) {
      const actionsColumn = {
        title: "Действия",
        width: 100,
        render: (_, record) => {
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
                  {config.archivable && (
                    <IsArchiveToggle
                      isArchive={record.isArchive}
                      onRestore={() => restore(record)}
                      onArchive={() => archive(record)}
                    />
                  )}
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
          <SimpleTitle text={config.title} access={access} create={create} />
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
