import React from "react";
import Form from "../Form/Form";

function Login(props) {
  // Добавляем стейты, которые привяжем к полям ввода (управляемые компоненты) в форме
  // name
  const [email, setEmail] = React.useState("");
  // description
  const [password, setPassword] = React.useState("");

  //обработчик изменения input
  function handleChange(event) {
    const target = event.target;
    // обновляем стейты в зависимости от имени поля: email или password
    target.name === "email"
      ? setEmail(target.value)
      : setPassword(target.value);
  }

  // обработчик Submit формы
  function handleSubmit(event) {
    event.preventDefault();
    setEmail("");
    setPassword("");
    props.onLogin(password, email);
  }

  return (
    <Form
      name={props.name}
      title={props.title}
      email={email}
      password={password}
      buttonSubmitText={props.buttonSubmitText}
      onSubmit={handleSubmit}
      onChange={handleChange}
    />
  );
}

export default Login;
