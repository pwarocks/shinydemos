set :domain,  "shinydemos.com"
set :user,    "shinydemos"

# name this the same thing as the directory on your server
set :application, "shinydemos.com"

default_run_options[:pty] = true  # Must be set for the password prompt from git to work
set :repository, "git@github.com:operasoftware/shinydemos.git"
set :scm, "git"
ssh_options[:forward_agent] = true

server "#{domain}", :app, :web, :primary => true

set :deploy_via, :remote_cache
set :copy_exclude, [".git"]

# set this path to be correct on yoru server
set :use_sudo, false
set :keep_releases, 3

# ssh_options[:paranoid] = false

#cap production deploy
task :production do
  set :branch, "master"
  role :web, "shinydemos.com"
  set :user, "shinydemos"
  set :deploy_to, "/home/shinydemos/#{application}"
end

#cap dev deploy
task :dev do
  set :branch, "deploy"
  role :web, "homes.oslo.osa"
  set :user, "devrelbot"
  set :deploy_to, "/home/devrelbot/public_html/dev.#{application}"
end

# this tells capistrano what to do when you deploy
namespace :deploy do

  desc <<-DESC
  A macro-task that updates the code and fixes the symlink.
  DESC
  task :default do
    transaction do
      update_code
      symlink
    end
  end

  task :update_code, :except => { :no_release => true } do
    on_rollback { run "rm -rf #{release_path}; true" }
    strategy.deploy!
  end

  task :after_deploy do
    cleanup
  end

end