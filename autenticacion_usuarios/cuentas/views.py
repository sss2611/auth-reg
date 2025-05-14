from django.http import HttpResponse
from django.shortcuts import render
from .forms import LoginForm, UserRegistrationForm
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required

# Create your views here.
def user_login(request):
        if request.method =="POST":
            form = LoginForm(request.POST)
            if form.is_valid():
                cd = form.cleaned_data
                user = authenticate(request,
                                    username=cd['username'],
                                    password=cd['password'])
                if user is not None:
                     if user.is_active:
                        login(request, user)
                        return HttpResponse("Usuario autenticado")
                     else:
                          return HttpResponse("Usuario inactivo")
                else:
                     return HttpResponse("Información incorrecta")
        else:
            form = LoginForm()
            return render(request, 'cuentas/login.html', {'form': form})


@login_required
def dashboard(request):
    return render(request,
                'cuentas/dashboard.html')

def register(request):
    if request.method == 'POST':
        user_form = UserRegistrationForm(request.POST)
        if user_form.is_valid():
            new_user = user_form.save(commit=False)
            new_user.set_password(
                user_form.cleaned_data['password']
            )
            new_user.save()
            return render(request,
                          'cuentas/register_done.html',
                          {'new_user':new_user})
    else:
        user_form = UserRegistrationForm()
    return render(request, 
                      'cuentas/register.html',
                      {'user_form': user_form})