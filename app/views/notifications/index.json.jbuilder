json.array! @notifications do |notification|
  json.id notification.id
  # json.recipient notification.recipient
  json.actor notification.actor.name
  json.action notification.action
  json.notifiable notification.notifiable
  # json.notifiable do
  #   json.type "#{notification.notifiable.class.to_s.underscore.humanize.downcase}"
  #   json.title notification.notifiable.title || ""
  #   json.slug notification.notifiable.slug
  # end
  # json.url followship_path
end