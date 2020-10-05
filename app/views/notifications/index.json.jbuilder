json.array! @notifications do |notification|
  json.id notification.id
  # json.recipient notification.recipient
  json.actor notification.actor.name
  json.action notification.action
  json.notifiable do # notification.notifiable
    json.type "#{notification.notifiable.class.to_s.underscore.humanize.downcase}"
  end
  json.url followship_path
end