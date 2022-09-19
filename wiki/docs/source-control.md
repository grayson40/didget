# Source Control

The following document will walk you through the process of creating a branch, committing and pushing changes up the branch, and then creating a pull request to merge your changes into the `master` branch.

## Create branch

1. Navigate to the bottom left corner of VS Code and click on the master branch. 

    ![create-branch](/wiki/assets/branch.png)

2. Select `Create new branch from...`.

    ![new-branch-from](/wiki/assets/new-branch-from.PNG)

3. Enter the name of your branch.

    ![name-branch](/wiki//assets/test-branch.PNG)

4. Select master as your base branch.

    ![base-off-master](/wiki/assets/base-off-master.PNG)

5. The bottom left corner of VS Code will show that you've successfully created and checked in to your new branch.

    ![see-new-branch](/wiki/assets/see-new-branch.PNG)

## Publish branch

1. Your branch is now created, but not published. Navigate to `Source Control` on the left pane and click on `Publish Branch`.

    ![publish-branch](/wiki/assets/publish-branch.PNG)

## Commit to branch

1. After implementing changes on your branch, navigate to `Source Control` on the left pane and click the `+` to stage the files that you've changed.

    ![stage-commit](/wiki/assets/stage-commit.PNG)

2. After staging the files that you want to commit, enter a commit message and click the `Commit` button.

    ![commit-message](/wiki/assets/commit-message.PNG)

## Push up branch

1. Now that your files are committed, you now have to push them up your branch. Click on the three dots to open the drop down menu and then click on `Push`.

    ![push-commit](/wiki/assets/push-commit.PNG)

## Create pull request

1. Now that your changed files are pushed up your branch, it is time to open a pull request to have your changes merged into the `master` branch. Navigate to the repo on github.com and select the `Compare and pull request` button.

    ![create-pull-request](/wiki/assets/create-pull-request.PNG)

2. Create a title describing the changes in your pull request and then select the `Create pull request` button.

    ![open-pull-request](/wiki/assets/open-pull-request.PNG)

## Merge pull request

1. Once your pull request has been reviewed and approved, it is time to merge your changes into the `master` branch. Click on the `Merge pull request` button to merge your changes into the `master` branch. 

    ![merge-pull-request](/wiki/assets/merge-pull-request.PNG)

### Your changes are now merged into master!!

# Updating

## How to update your local branch to master

1. Execute the following commands:

    `git fetch origin master`

    `git merge origin/master`

# Checking out

## How to checkout another branch

1. Execute the following commands:

    `git checkout <name of branch>`

    `git pull`

### **OR**

1. Navigate to the bottom left of VS Code and click on your current checked out branch.

    ![checkout-branch](/wiki/assets/checkout-branch.PNG)

2. Select desired branch to checkout.

    ![branch-select](/wiki/assets/branch-select.PNG)

3. Execute the following command:

    `git pull`