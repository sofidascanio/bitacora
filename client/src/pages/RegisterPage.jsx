import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useRegister } from '../features/auth/hooks/useAuthMutations.js'
import { Input } from '../components/common/Input/Input.jsx'
import { Button } from '../components/common/Button/Button.jsx'
import styles from './AuthPage.module.css'

export function RegisterPage() {
    const [form, setForm] = useState({ username: '', email: '', password: '' })
    const { mutate: register, isPending, error } = useRegister()

    const apiError = error?.response?.data?.message

    function handleChange(e) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    function handleSubmit(e) {
        e.preventDefault()
        register(form)
    }

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <header className={styles.header}>
                    <span className={styles.eyebrow}> Empeza ahora! </span>
                    <h1 className={styles.title}> Crea tu cuenta </h1>
                </header>

                {apiError && <div className={styles.alert}>{apiError}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <Input id="username"
                        name="username"
                        type="text"
                        label="Username"
                        placeholder="tunombre"
                        value={form.username}
                        onChange={handleChange}
                        required/>
                    <Input id="email"
                        name="email"
                        type="email"
                        label="Email"
                        placeholder="nombre@ejemplo.com"
                        value={form.email}
                        onChange={handleChange}
                        required/>
                    <Input id="password"
                        name="password"
                        type="password"
                        label="Password"
                        placeholder="Al menos 8 caracteres"
                        value={form.password}
                        onChange={handleChange}
                        required/>
                    <Button type="submit" loading={isPending} size="lg" className={styles.submitBtn}>
                        Crear Cuenta
                    </Button>
                </form>

                <p className={styles.footer}>
                    Ya tenes cuenta?{' '}
                    <Link to="/login" className={styles.link}>Iniciar Sesión</Link>
                </p>
            </div>
        </div>
    )
}