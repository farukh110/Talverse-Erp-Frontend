// import { observable } from 'mobx';

class LoginModel {
  tenancyName!: string;
  userNameOrEmailAddress!: string;
  password!: string;
  rememberMe!: boolean;

  toggleRememberMe = () => {
    this.rememberMe = !this.rememberMe;
  };

}

export default LoginModel;
