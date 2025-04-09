import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Toaster, toast } from 'react-hot-toast';
import {useStore} from "../hooks/store.tsx";
import  logoLogin  from "../assets/logo.jpeg"
export default function AdminLogin() {
  const navigate = useNavigate();
  const auth = useStore();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação dos campos
    let hasErrors = false;
    const newErrors = {
      email: '',
      password: ''
    };
    
    if (!formData.email) {
      newErrors.email = 'E-mail é obrigatório';
      hasErrors = true;
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
      hasErrors = true;
    }
    
    setErrors(newErrors);
    
    if (hasErrors) return;
    
    try {
      setIsLoading(true);
      
      // Chamada para a API de autenticação
      const response = await auth.login(formData.email, formData.password);
      if (response?.token) {
        // Armazenar o token nos cookies
        toast.success('Login realizado com sucesso!');
        navigate('/home');
      } else {
        toast.error('Falha na autenticação. Verifique suas credenciais.');
      }
    } catch (error) {
      toast.error('Erro ao conectar com o servidor. Tente novamente mais tarde.');
      console.error('Erro de login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
      <div className="min-h-screen flex flex-col items-center justify-center light:bg-gray-100 dark:bg-black">
        <div
            className="w-full rounded-xl max-w-md p-8 space-y-8 bg-background dark:bg-white shadow-md dark:shadow-white">
          <div className="text-center">
            <img
                src={logoLogin}
                alt="LocMoto Logo"
                className="mx-auto w-64 h-auto mb-8"
            />
            <h2 className="text-2xl font-bold text-primary dark:text-black">Área Admin</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full dark:placeholder:text-black text-black ${errors.email ? 'border-red-500' : ''}`}
                  required
              />
              {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Input
                  type="password"
                  name="password"
                  placeholder="Senha"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full dark:placeholder:text-black text-black ${errors.password ? 'border-red-500' : ''}`}
                  required
              />
              {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <Button
                type="submit"
                className="w-full px-4 py-2 text-lg bg-green-900 hover:bg-green-800 text-gray-50"
                disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </div>
        <Toaster position="top-right"/>
      </div>
  );
}