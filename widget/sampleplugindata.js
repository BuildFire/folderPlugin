/*
Created by Lucio Montero in 18th, April, 2018, in order to test an improvement to the folderPlugin plugin of Buildfire, requested in the webpage 
https://bountify.co/folder-layout-12-does-not-have-dots-to-indicate-more-items. The bug to be fixed is that in the list layout 12 this plugin should 
display an ellipsis to indicate that the user can swipe downwards to discover more elements. As in the private server run of this plugin, the plugins
list does not appear, so I had to create the functions below to invent data for an arbitrary number of immaginary plugins.
In order to use the sample plugin names, you should uncomment the line saying <!--script src="sampleplugindata.js" type="text/javascript"/--> (line 102) 
and the line saying //getFakePluginsList(16, function (result) { (line 225) in the index.html file in this folder, and comment the line saying 
getPlugins(obj, function (result) { (line 224). The number (16) in the line 225 is the number of sample plugins names to invent information for.
*/
function getFakePluginsList(nFakePlugins, callback) {
    plugins = getFakePluginDetails(nFakePlugins);
    callback(plugins);
}
function getFakePluginDetails(nFakePlugins) {
    /*Create information entries for an arbitrary number of fake Buildfire plugins.
    nFakePlugins is the number of the fake plugins to invent data for.
    */
    var returnPlugins = [];
    var tempPlugin = null;
    for (var id = 0; id < nFakePlugins; id++) {
        tempPlugin = {};
        tempPlugin.instanceId = "instance "+id;
        tempPlugin.iconUrl = "icon "+id;
        tempPlugin.iconClassName = "icon class "+id;
        tempPlugin.title = "title "+id;
        tempPlugin.pluginTypeId = "pluginTypeId "+id;
        tempPlugin.folderName = "folderName "+id;
        returnPlugins.push(tempPlugin);
        tempPlugin = null;
    }
    return returnPlugins;
}
