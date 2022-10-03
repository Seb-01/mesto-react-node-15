import React from "react";
import Form from "../Form/Form";
import { Link, withRouter } from "react-router-dom";

class Registration extends React.Component {
  constructor(props) {
    // Добавляем стейты, которые привяжем к полям ввода (управляемые компоненты) в форме
    super(props);
    this.state = {
      password: "",
      email: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //обработчик изменения input
  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  }

  // обработчик Submit формы
  handleSubmit(event) {
    event.preventDefault();
    this.props.onRegister(this.state.password, this.state.email);
  }

  render() {
    return (
      <>
        <Form
          name={this.props.name}
          title={this.props.title}
          email={this.state.email}
          password={this.state.password}
          buttonSubmitText={this.props.buttonSubmitText}
          onSubmit={this.handleSubmit}
          onChange={this.handleChange}
        >
          <Link to="/sign-in" className="form__login-link">
            Уже зарегистрированы? Войти
          </Link>
        </Form>
      </>
    );
  }
}

export default withRouter(Registration);
