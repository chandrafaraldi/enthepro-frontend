import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await login(formData.email, formData.password);

      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Login Berhasil",
          text: "Selamat Datang!",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/home");
      } else {
        // Error handling as per AuthContext return
        if (typeof response.message === 'object') {
           setErrors(response.message);
        } else {
          Swal.fire({
            icon: "error",
            title: "Login Gagal!",
            text: response.message || "Email atau password salah.",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      }
    } catch (error) {
       Swal.fire({
        icon: "error",
        title: "Kesalahan",
        text: "Terjadi kesalahan pada server.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h4 className="mb-4 text-center fw-bold">Masuk</h4>
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3">
          <Form.Label className="small fw-semibold">Email</Form.Label>
          <Form.Control
            isInvalid={!!errors?.email}
            name="email"
            type="email"
            placeholder="Masukan email"
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.email}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Label className="small fw-semibold">Password</Form.Label>
          <Form.Control
            isInvalid={!!errors?.password}
            name="password"
            type="password"
            placeholder="Masukkan password"
            onChange={handleChange}
          />
          <Form.Control.Feedback type="invalid">
            {errors?.password}
          </Form.Control.Feedback>
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100 mb-3 py-2">
          Masuk
        </Button>
        <div className="text-center small">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="text-primary fw-bold text-decoration-none"
          >
            Daftar sekarang
          </Link>
        </div>
      </Form>
    </div>
  );
}
