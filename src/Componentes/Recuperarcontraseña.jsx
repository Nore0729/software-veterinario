import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';
import '../Estilos_F/RecuperarContraseña.css';
import { useForm } from 'react-hook-form';
import { BiShow, BiHide } from 'react-icons/bi';

function RecuperarContraseña() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const generateVerificationCode = () => {
    const length = 6;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    console.log(code)
    return code;
  };

  const handleSendCode = (data) => {
    const code = generateVerificationCode();
    setVerificationCode(code);
    setEmail(data.email);
    console.log(data.email)
    console.log(email)
    const Params=
    {
      email: email,
      passcode: code,
    }

    emailjs
      .send(
        'service_8xog7f1',
        'template_54r481o',
        Params,
        'tiIgYIyXTybTyjObZ'
      )
      .then(
        () => {
          Swal.fire('Éxito', 'Código enviado al correo', 'success');
          setStep(2);
          reset();
        },
        () => Swal.fire('Error', 'No se pudo enviar el correo', 'error')
      );
  };

  const handleVerifyCode = (data) => {
    console.log(data)
    if (data.code === verificationCode) {
      Swal.fire('Éxito', 'Código verificado', 'success');
      setStep(3);
      reset();
    } else {
      Swal.fire('Error', 'Código incorrecto', 'error');
    }
  };

  const handleResetPassword = async (data) => {
    const { password } = data;
    try {
      const response = await fetch('http://localhost:3001/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword: password }),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire('Éxito', 'Contraseña restablecida correctamente', 'success').then(() => {
          navigate('/login');
        });
        reset();
      } else {
        Swal.fire('Error', result.message || 'Error al restablecer la contraseña', 'error');
      }
    } catch (error) {
      console.error('Error al enviar la solicitud de restablecimiento:', error);
      Swal.fire('Error', 'Error de conexión con el servidor', 'error');
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return 'Recuperar Contraseña';
      case 2:
        return 'Verificar Código';
      case 3:
        return 'Nueva Contraseña';
      default:
        return '';
    }
  };

  const getStepSubtitle = () => {
    switch (step) {
      case 1:
        return 'Escriba el correo vinculado con su cuenta para el restablecimiento de su contraseña';
      case 2:
        return 'Ingrese el código enviado a su correo';
      case 3:
        return 'Establezca su nueva contraseña';
      default:
        return '';
    }
  };

  return (
    <main className="login-main">
      <div className="der-side">
        <div className="login-form">
          <h1 className="form-title">{getStepTitle()}</h1>

          <div className="steps-indicator-container">
            <div className={`step-circle ${step === 1 ? 'active' : ''}`}>1</div>
            <div className={`step-circle ${step === 2 ? 'active' : ''}`}>2</div>
            <div className={`step-circle ${step === 3 ? 'active' : ''}`}>3</div>
          </div>

          <p className="form-subtitle">{getStepSubtitle()}</p>

          {step === 1 && (
            <form onSubmit={handleSubmit(handleSendCode)}>
              <label>
                <strong>Email</strong>
                <input
                  type="email"
                  {...register('email', { required: 'El email es obligatorio' })}
                  className={errors.email ? 'input-error' : ''}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="error-message">{errors.email.message}</p>}
              </label>
              <button type="submit" className="login-submit-btn">Enviar Código</button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit(handleVerifyCode)}>
              <label>
                <strong>Código de Verificación</strong>
                <input
                  type="text"
                  {...register('code', { required: 'El código es obligatorio' })}
                  className={errors.code ? 'input-error' : ''}
                />
                {errors.code && <p className="error-message">{errors.code.message}</p>}
              </label>
              <button type="submit" className="login-submit-btn">Verificar Código</button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit(handleResetPassword)}>
              <label>
                <strong>Nueva Contraseña</strong>
                <div className="password-input-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'La contraseña es obligatoria',
                      pattern: {
                        value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?!.*\s).{8,}$/,
                        message:
                          'La contraseña debe contener al menos una letra mayúscula, una minúscula, un número, un carácter especial y tener al menos 8 caracteres.',
                      },
                    })}
                    className={errors.password ? 'input-error' : ''}
                  />
                  <span
                    className="password-toggle-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <BiShow size={20} /> : <BiHide size={20} />}
                  </span>
                </div>
                {errors.password && <p className="error-message">{errors.password.message}</p>}
              </label>

              <label>
                <strong>Confirmar Contraseña</strong>
                <div className="password-input-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('confirmPassword', {
                      required: 'La confirmación de contraseña es obligatoria',
                      validate: (value) =>
                        value === watch('password') || 'Las contraseñas no coinciden',
                    })}
                    className={errors.confirmPassword ? 'input-error' : ''}
                  />
                  <span
                    className="password-toggle-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <BiShow size={20} /> : <BiHide size={20} />}
                  </span>
                </div>
                {errors.confirmPassword && (
                  <p className="error-message">{errors.confirmPassword.message}</p>
                )}
              </label>

              <button type="submit" className="login-submit-btn">Restablecer Contraseña</button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

export default RecuperarContraseña;
