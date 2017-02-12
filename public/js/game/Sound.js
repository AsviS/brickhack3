/**
 * @fileoverview Sound handler class
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

function Sound(sounds) {
  this.sounds = sounds;
}

Sound.BASE_SOUND_URL = '/public/sound/';

Sound.SOUND_SRCS = {
  shoot: [
    'shoot1.mp3',
    'shoot2.mp3',
    'shoot3.mp3'
  ],
  explosion: [
    'explosion1.wav',
    'explosion2.wav'
  ],
  death: [
    'death1.mp3'
  ]
};

Sound.create = function() {
  var sounds = {};
  for (var key in Sound.SOUND_SRCS) {
    sounds[key] = Sound.SOUND_SRCS[key].map((src) => {
      return new Howl({ src: Sound.BASE_SOUND_URL + src });
    });
  }
  return new Sound(sounds);
};

Sound.prototype.play = function(sound, volume) {
  var sound = Util.choiceArray(this.sounds[sound]);
  var id = sound.play();
  sound.volume(Util.bound(volume, 0, 1), id);
};
