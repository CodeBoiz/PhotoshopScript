// Set the ruler units to pixels 
var originalRulerUnits = app.preferences.rulerUnits 
app.preferences.rulerUnits = Units.PIXELS

// Put your path to where the photoshop templete is located
var fileRef = File("C:\\Users\\jones\\Downloads\\dark-grey-heather_1.psd");
var docRef = app.open(fileRef);

var filePath = Folder.selectDialog('Select folder with target elements');
var outputFolder = Folder.selectDialog('Select Output Folder');

var files = filePath.getFiles();

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

function savePng(name, folder, quality){
	var doc = app.activeDocument;
	var file = new File(folder + '/' + name + '.jpg');
	var opts = new PNGSaveOptions();
	opts.quality = quality;
	opts.embedColorProfile = true;
	doc.saveAs(file, opts, true);
}

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

// gets IDs of all smart objects
var lyrs = getLyrs();

for (var i = 0; i < files.length; i++) {
    // for each SO id...

    // select it
    selectById(lyrs[0]);

    // relink SO to file
    relinkSO(files[i]);

    // embed linked if you want
    embedLinked()

    savePng("Thumbnail_" + i, outputFolder, 12);
}