# replace these with your server's information
set :domain,  "shinydemos.com"
set :user,    "shinydemos"

# name this the same thing as the directory on your server
set :application, "dev.shinydemos.com"

# or use a hosted repository
#set :repository, "ssh://user@example.com/~/git/test.git"

default_run_options[:pty] = true  # Must be set for the password prompt from git to work
set :repository, "git@github.com:operasoftware/shinydemos.git"  # Your clone URL
set :scm, "git"
set :user, "shinydemos"  # The server's user for deploys
# set :scm_passphrase, "p@ssw0rd"  # The deploy user's password
ssh_options[:forward_agent] = true

server "#{domain}", :app, :web, :db, :primary => true

set :deploy_via, :remote_cache
set :copy_exclude, [".git", ".DS_Store"]

set :branch, "master"
# set this path to be correct on yoru server
set :deploy_to, "/home/#{user}/#{application}"
set :use_sudo, false
set :keep_releases, 3

# ssh_options[:paranoid] = false

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