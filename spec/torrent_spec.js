describe 'Torrent'
  describe 'isActive'
    it 'should be true when the torrent is seeding'
      var seeding = kettu.Torrent.stati['seeding'];
      kettu.Torrent({status: seeding}).isActive().should.be_true;
    end
    
    it 'should be true when the torrent is downloading'
      var downloading = kettu.Torrent.stati['downloading'];
      kettu.Torrent({status: downloading}).isActive().should.be_true;
    end
    
    it 'should be false when the torrent is waiting for check'
      var waiting_for_check = kettu.Torrent.stati['waiting_to_check'];
      kettu.Torrent({status: waiting_for_check}).isActive().should.be_false;
    end
    
    it 'should be false when the torrent is checking'
      var checking = kettu.Torrent.stati['checking'];
      kettu.Torrent({status: checking}).isActive().should.be_false;
    end
    
    it 'should be false when the torrent is paused'
      var paused = kettu.Torrent.stati['paused'];
      kettu.Torrent({status: paused}).isActive().should.be_false;
    end
  end
  
  describe 'isDoneDownloading'
    it 'should be true when the status is seeding even if leftUntilDone is great than 0'
      var seeding = kettu.Torrent.stati['seeding'];
      kettu.Torrent({status: seeding, leftUntilDone: 1000}).isDoneDownloading().should.be_true;
    end
    
    it 'should be true when leftUntilDone is 0'
      var paused = kettu.Torrent.stati['paused'];
      kettu.Torrent({status: paused, leftUntilDone: 0}).isDoneDownloading().should.be_true;
    end
    
    it 'should be true when leftUntilDone is 0'
      var paused = kettu.Torrent.stati['paused'];
      kettu.Torrent({status: paused, leftUntilDone: 1000}).isDoneDownloading().should.be_false;
    end
  end
  
  describe 'percentDone'
    it 'should return 0 when sizeWhenDone is null'
      kettu.Torrent({sizeWhenDone: null}).percentDone().should.eql('0');
    end
  
    it 'should return 0 when leftUntilDone is null'
      kettu.Torrent({leftUntilDone: null}).percentDone().should.eql('0');
    end
  
    it 'should truncate to 2 decimals'
      kettu.Torrent({sizeWhenDone: 100000, leftUntilDone: 50666}).percentDone().should.eql('49.33');
    end
  
    it 'should always round done so that 100% isn\'t premature'
      kettu.Torrent({sizeWhenDone: 100000, leftUntilDone: 1}).percentDone().should.eql('99.99');
    end
    
    it 'should return 100 when all is downloaded'
      kettu.Torrent({sizeWhenDone: 100000, leftUntilDone: 0}).percentDone().should.eql('100.00');
    end
  end
  
  describe 'etaString'
    it 'should be unknown when less than 0'
      kettu.Torrent({eta: -1}).etaString().should.eql('remaining time unknown');
    end
  
    it 'should format the time correctly'
      kettu.Torrent({eta: 3660}).etaString().should.eql('1 hr 1 min remaining');
    end
  end
  
  describe 'downloadingProgress'
    it 'should create a human readable string from sizeWhenDone and leftUntilDone'
      var torrent = kettu.Torrent({sizeWhenDone: 100000, leftUntilDone: 50666});
      torrent.downloadingProgress().should.eql('48.2 KB of 97.7 KB (49.33%)');
    end
  end
  
  describe 'uploadingProgress'
    it 'should create a human readable string from sizeWhenDone, uploadRatio and uploadedEver'
      var torrent = kettu.Torrent({sizeWhenDone: 100000, uploadedEver: 50666, uploadRatio: 0.52});
      torrent.uploadingProgress().should.eql('97.7 KB, uploaded 49.5 KB (Ratio: 0.52)');
    end
  end
  
  describe 'statusString'
    it 'should contain a human readable status'
      kettu.Torrent({status: kettu.Torrent.stati['checking']}).statusString().should.match(/Verifying local data/);
    end
    
    it 'should contain the up and download speed'
      var torrent = kettu.Torrent({status: kettu.Torrent.stati['downloading'], rateUpload: 10000, rateDownload: 10000, leftUntilDone: 10});
      torrent.statusString().should.match(/DL: 10.0 KB\/s, UL: 10.0 KB\/s/);
    end
    
    it 'should not contain the download speed when torrent is seeding'
      var torrent = kettu.Torrent({status: kettu.Torrent.stati['seeding'], rateUpload: 10000, rateDownload: 10000});
      torrent.statusString().should_not.match(/DL: 10.0 KB\/s/);
    end
    
    it 'should not contain up and download speed when torrent is not active'
      var torrent = kettu.Torrent({status: kettu.Torrent.stati['paused'], rateUpload: 10000, rateDownload: 10000});
      torrent.statusString().should_not.match(/DL: 10.0 KB\/s, UL: 10.0 KB\/s/);
    end
  end
  
  describe 'progressBar'
    it 'should add class downloading if it\'s a downloading torrent'
      var torrent = kettu.Torrent({status: kettu.Torrent.stati['downloading'], metadataPercentComplete: 1});
      torrent.progressBar().should.match(/downloading/);
    end

    it 'should add class uploading if it\'s a seeding torrent'
      var torrent = kettu.Torrent({status: kettu.Torrent.stati['seeding'], metadataPercentComplete: 1});
      torrent.progressBar().should.match(/uploading/);
    end
    
    it 'should add class paused if it\'s a paused torrent'
      var torrent = kettu.Torrent({status: kettu.Torrent.stati['paused'], metadataPercentComplete: 1});
      torrent.progressBar().should.match(/paused/);
    end
    
    it 'should add class meta if it\'s a torrent retrieving meta data'
      var torrent = kettu.Torrent({status: kettu.Torrent.stati['downloading'], metadataPercentComplete: 0});
      torrent.progressBar().should.match(/meta/);
    end
    
    it 'should fill the whole progressbar if it\'s retrieving meta data'
      var torrent = kettu.Torrent({status: kettu.Torrent.stati['downloading'], metadataPercentComplete: 0});
      torrent.progressBar().should.match(/100%/);
    end
  end
end