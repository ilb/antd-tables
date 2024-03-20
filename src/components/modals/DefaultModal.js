import { AutoForm, SubmitField } from "uniforms-antd";
import { Modal } from "antd";
import { CustomAutoField } from "@ilb/uniformscomponentsantd";
import { useEffect, useRef, useState } from "react";
import { createSchemaBridge } from "@ilb/ajvinstance";

const DefaultModal = ({ isOpen, hide, record, schema, onSubmit }) => {
  const [model, setModel] = useState(record);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setModel(record);
  }, [record?.id]);

  const formRef = useRef();
  const isCreate = () => !model?.id;

  const getTitle = () => (isCreate() ? "Создание" : "Редактирование");

  const CustomSubmitField = () => {
    return <SubmitField loading={loading} value="Сохранить" />;
  };

  const reset = () => formRef.current.reset();

  return (
    <Modal title={getTitle()} visible={isOpen} footer={null} onCancel={() => {
      hide();
      reset();
    }}>
      <AutoForm
        showInlineError
        ref={formRef}
        submitField={CustomSubmitField}
        autoField={CustomAutoField}
        errorsField={() => <></>}
        schema={createSchemaBridge(schema)}
        onSubmit={async (model) => {
          setLoading(true)
          const isSaved = await onSubmit(model);
          setLoading(false)

          if (isSaved) {
            reset();
          }
        }}
        model={model}
      />
    </Modal>
  );
};

export default DefaultModal;
