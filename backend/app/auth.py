from flask import Blueprint, Response, flash, redirect, render_template_string, request, url_for
from flask_login import current_user, login_user, logout_user
from sqlalchemy import select

from app.extensions import db, login_manager
from app.models import AdminUser

auth_bp: Blueprint = Blueprint("auth", __name__)

LOGIN_TEMPLATE: str = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Soyuz Corp Admin Login</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; min-height: 100vh; display: grid; place-items: center; background: #f4f7fb; }
      form { width: min(420px, calc(100vw - 32px)); background: #fff; padding: 28px; border-radius: 8px; box-shadow: 0 12px 40px rgba(0,0,0,.08); }
      label { display: block; font-weight: 700; margin: 16px 0 8px; }
      input { width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #cdd7e3; border-radius: 6px; font-size: 16px; }
      button { width: 100%; margin-top: 22px; padding: 12px; border: 0; border-radius: 6px; background: #005f9f; color: #fff; font-weight: 700; font-size: 16px; }
      .error { color: #a30000; margin-bottom: 12px; }
    </style>
  </head>
  <body>
    <form method="post">
      <h1>Admin Login</h1>
      {% with messages = get_flashed_messages() %}
        {% if messages %}
          {% for message in messages %}
            <p class="error">{{ message }}</p>
          {% endfor %}
        {% endif %}
      {% endwith %}
      <label for="email">Email</label>
      <input id="email" name="email" type="email" required>
      <label for="password">Password</label>
      <input id="password" name="password" type="password" required>
      <button type="submit">Log in</button>
    </form>
  </body>
</html>
"""


@login_manager.user_loader
def load_user(user_id: str) -> AdminUser | None:
    return db.session.get(AdminUser, int(user_id))


@auth_bp.route("/login", methods=["GET", "POST"])
def login() -> str | Response:
    if current_user.is_authenticated:
        return redirect(url_for("admin.index"))

    if request.method == "POST":
        email: str = request.form["email"]
        password: str = request.form["password"]
        query = select(AdminUser).where(AdminUser.email == email)
        user: AdminUser | None = db.session.scalars(query).first()

        if user is None or not user.check_password(password):
            flash("Invalid email or password.")
            return render_template_string(LOGIN_TEMPLATE), 401

        login_user(user)
        return redirect(url_for("admin.index"))

    return render_template_string(LOGIN_TEMPLATE)


@auth_bp.get("/logout")
def logout() -> Response:
    logout_user()
    return redirect(url_for("auth.login"))
