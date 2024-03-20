/**
 * Компонент доступа
 * @param children - Дочерний элемент компонента.
 * @param {array} availables - Разрешения, которые есть у пользователя.
 * @param {array} needed - Разрешение, необходимое для доступа.
 */
const Access = ({ children, availables, needed  }) => {
  return <>{availables.includes(needed) && children}</>;
};

export default Access;
