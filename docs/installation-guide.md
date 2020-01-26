# Installation Guide

This is a guide for installing the custom macro API. The custom macro API itself does **not** include any custom macros, it is instead a resource to allow for the creation of custom macros. If you want to create your own custom macros, refer to the [documentation](README.md).

## Step 1: Get the Code

Head over to the [releases page](https://github.com/ChapelR/harlowe-macro-api/releases) and find the latest release. Under `assets`, find the `harlowe-macro-api.zip` file and click on it to download it. On your computer, extract the files from the zip archive.

## Step 2: Copy the Code

Open the `macro.js` file in a **text editor** (like Notepad or TextEdit). It is very important you do not use a word processor. Select all the code and copy it (`CTRL + A` followed by `CTRL + C` should work fine).

## Step 3: Paste the Code

Open Twine 2, either the application on your computer, or on the web. Open your story, or start a new one. In the bottom left is an up arrow next to your story's name, click this and select the `Edit Story JavaScript` option.

![Story JavaScript](https://i.imgur.com/lY52aWU.jpg)

In the resulting editor window, paste the code you copied in Step 2. If there is already code in your JavaScript section, or you plan to add more, make sure this code is first.

Since macros you write or install will *always* depend on this code, you always want to make sure you paste your custom macros in *under* the code we just pasted in now.

## But I'm Not Using Twine 2!

Refer to the docs of whatever compiler you are using for instructions on how to add the code to your project. With compilers like Tweego or Extwee, installation is as simple as copying the `macro.js` file itself over into your project directory. Just make sure that this file loads **first** you can do that in Tweego and Extwee by changing the file name so that it appears first in the directory, e.g. by changing it to `a-macro.js`.

If your compiler does not support multiple scripts or doesn't allow you to control their order, make sure this script and all the custom macros that depend on it are in the same place and that this script is first.

## FAQ

### Should I credit you?

This project is free and dedicated to the public domain. You do not have to provide credit or attribution. If you decide to do so, you may credit me as Chapel, but please don't imply I personally worked on your game, as that can make it seem like I support or endorse whatever it is.

### I'm having trouble...

[Open an issue](https://github.com/ChapelR/harlowe-macro-api/issues) and ask me for help, I'll do what I can. You can also ask in any one of the various Twine communities and I'll try to help.

### Is there a list of custom macros somewhere?

Not yet. If people start making a decent amount I'll consider compiling some sort of list.