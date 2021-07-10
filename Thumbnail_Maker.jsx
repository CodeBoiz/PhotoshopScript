//Set Units
app.preferences.rulerUnits = Units.PIXELS

var fileRef = File("C:\\Users\\jones\\Downloads\\dark-grey-heather_1.psd")
var mainFolder = Folder.selectDialog('Select Folder With Original Designs');
var transparentFolder = Folder.selectDialog('Select Folder For Outputting Transparent Designs');
var thumbnailFolder = Folder.selectDialog('Select Folder For Outputting Thumbsnails');

var files = mainFolder.getFiles();

for(var i = 0; i < files.length; i++)
{
    //Load Design
    var file = files[i]
    var docRef = app.open(file)
    var designName = file.name.substring(0, file.name.lastIndexOf('.'))

    //Select Background
    selectColorRange(
        RGBc(0.0, 0.0, 0.0),
        RGBc(3.0, 3.0, 3.0)
    );
    function cTID(s) { return app.charIDToTypeID(s); }
    function sTID(s) { return app.stringIDToTypeID(s); }
    function RGBc(r, g, b) {
        var color = new ActionDescriptor();
            color.putDouble( cTID("Rd  "), r);
            color.putDouble( cTID("Grn "), g);
            color.putDouble( cTID("Bl  "), b);   
        return color
    }
    function selectColorRange(color1, color2){
        var desc = new ActionDescriptor(); 
        desc.putInteger(cTID("Fzns"), 0 ); 
        desc.putObject( cTID("Mnm "), cTID("RGBC"), color1 ); 
        desc.putObject( cTID("Mxm "), cTID("RGBC"), color2 ); 
        executeAction( cTID("ClrR"), desc, DialogModes.NO );
    }

    function getLyrs() {
        var ids = [];
        var layers, desc, vis, type, id;
    
        try
        {
          activeDocument.backgroundLayer;
          layers = 0;
        }
        catch (e)
        {
          layers = 1;
        }
    
        while (true)
        {
          ref = new ActionReference();
          ref.putIndex(charIDToTypeID('Lyr '), layers);
          try
          {
            desc = executeActionGet(ref);
          }
          catch (err)
          {
            break;
          }
          vis = desc.getBoolean(charIDToTypeID("Vsbl"));
          type = desc.getInteger(stringIDToTypeID("layerKind"));
          id = desc.getInteger(stringIDToTypeID("layerID"));
          if (type == 5 && vis) ids.push(id);
          layers++;
        }
        return ids;
    
    } // end of getLyrs()

    function selectById(id) {
        var desc = new ActionDescriptor();
        var ref = new ActionReference();
        ref.putIdentifier(charIDToTypeID('Lyr '), id);
        desc.putReference(charIDToTypeID('null'), ref);
        executeAction(charIDToTypeID('slct'), desc, DialogModes.NO);
    } // end of selectById()
    
    function relinkSO(path) {
      var desc = new ActionDescriptor();
      desc.putPath( charIDToTypeID('null'), new File( path ) );
      executeAction( stringIDToTypeID('placedLayerRelinkToFile'), desc, DialogModes.NO );
    } // end of relinkSO()
    
    function embedLinked() {
      executeAction( stringIDToTypeID('placedLayerConvertToEmbedded'), undefined, DialogModes.NO );
    } // end of embedLinked()

    function savePng(name, folder, quality){
        var doc = app.activeDocument;
        var file = new File(folder + '/' + name + '.jpg');
        var opts = new PNGSaveOptions();
        opts.quality = quality;
        opts.embedColorProfile = true;
        doc.saveAs(file, opts, true);
    }

    //Delete Background
    activeDocument.selection.clear()
    activeDocument.selection.deselect()

    //Save Transparent Image
    var transparentFile = new File(transparentFolder + "/"+ designName + " Transparent.png")
    var pngSaveOptions = new PNGSaveOptions
    pngSaveOptions.compression = 9
    pngSaveOptions.interlaced = false
    activeDocument.saveAs( transparentFile , pngSaveOptions, true, Extension.LOWERCASE)

    //Close Image
    docRef.close(SaveOptions.DONOTSAVECHANGES)

    //Load Mockup    
    docRef = app.open(fileRef)

    // gets IDs of all smart objects
    var lyrs = getLyrs();

    // select it
    selectById(lyrs[0]);

    // relink SO to file
    relinkSO(transparentFile);

    // embed linked if you want
    embedLinked()

    savePng("Thumbnail_" + i, thumbnailFolder, 12);
}