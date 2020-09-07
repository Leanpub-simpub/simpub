class WelcomeMailer < ApplicationMailer

  def welcome_email(user)
    @user = user
    mail(to: @user.eamil, subject: '恭喜註冊成功')
  end
end
