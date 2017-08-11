"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var web_animations_player_1 = require("../../../src/render/web_animations/web_animations_player");
function main() {
    var element;
    var innerPlayer = null;
    beforeEach(function () {
        element = {};
        element['animate'] = function () { return innerPlayer = new MockDomAnimation(); };
    });
    describe('WebAnimationsPlayer tests', function () {
        it('should automatically pause the player when created and initialized', function () {
            var keyframes = [
                { opacity: 0, offset: 0 },
                { opacity: 1, offset: 1 },
            ];
            var player = new web_animations_player_1.WebAnimationsPlayer(element, keyframes, { duration: 1000 });
            player.init();
            var p = innerPlayer;
            expect(p.log).toEqual(['pause']);
            player.play();
            expect(p.log).toEqual(['pause', 'play']);
        });
        it('should not pause the player if created and started before initialized', function () {
            var keyframes = [
                { opacity: 0, offset: 0 },
                { opacity: 1, offset: 1 },
            ];
            var player = new web_animations_player_1.WebAnimationsPlayer(element, keyframes, { duration: 1000 });
            player.play();
            var p = innerPlayer;
            expect(p.log).toEqual(['play']);
        });
    });
}
exports.main = main;
var MockDomAnimation = (function () {
    function MockDomAnimation() {
        this.log = [];
        this.onfinish = function () { };
        this.position = 0;
        this.currentTime = 0;
    }
    MockDomAnimation.prototype.cancel = function () { this.log.push('cancel'); };
    MockDomAnimation.prototype.play = function () { this.log.push('play'); };
    MockDomAnimation.prototype.pause = function () { this.log.push('pause'); };
    MockDomAnimation.prototype.finish = function () { this.log.push('finish'); };
    MockDomAnimation.prototype.addEventListener = function (eventName, handler) { };
    MockDomAnimation.prototype.dispatchEvent = function (eventName) { };
    return MockDomAnimation;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViX2FuaW1hdGlvbnNfcGxheWVyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9hbmltYXRpb25zL2Jyb3dzZXIvdGVzdC9yZW5kZXIvd2ViX2FuaW1hdGlvbnMvd2ViX2FuaW1hdGlvbnNfcGxheWVyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFRQSxrR0FBNkY7QUFFN0Y7SUFDRSxJQUFJLE9BQVksQ0FBQztJQUNqQixJQUFJLFdBQVcsR0FBMEIsSUFBSSxDQUFDO0lBQzlDLFVBQVUsQ0FBQztRQUNULE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDYixPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsY0FBUSxNQUFNLENBQUMsV0FBVyxHQUFHLElBQUksZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5RSxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQywyQkFBMkIsRUFBRTtRQUNwQyxFQUFFLENBQUMsb0VBQW9FLEVBQUU7WUFDdkUsSUFBTSxTQUFTLEdBQUc7Z0JBQ2hCLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDO2dCQUN2QixFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQzthQUN4QixDQUFDO1lBRUYsSUFBTSxNQUFNLEdBQUcsSUFBSSwyQ0FBbUIsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7WUFFN0UsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2QsSUFBTSxDQUFDLEdBQUcsV0FBYSxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUVqQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDZCxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHVFQUF1RSxFQUFFO1lBQzFFLElBQU0sU0FBUyxHQUFHO2dCQUNoQixFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQztnQkFDdkIsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUM7YUFDeEIsQ0FBQztZQUVGLElBQU0sTUFBTSxHQUFHLElBQUksMkNBQW1CLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1lBRTdFLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNkLElBQU0sQ0FBQyxHQUFHLFdBQWEsQ0FBQztZQUN4QixNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUF0Q0Qsb0JBc0NDO0FBRUQ7SUFBQTtRQUNFLFFBQUcsR0FBYSxFQUFFLENBQUM7UUFLbkIsYUFBUSxHQUFhLGNBQU8sQ0FBQyxDQUFDO1FBQzlCLGFBQVEsR0FBVyxDQUFDLENBQUM7UUFDckIsZ0JBQVcsR0FBVyxDQUFDLENBQUM7SUFHMUIsQ0FBQztJQVRDLGlDQUFNLEdBQU4sY0FBaUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNDLCtCQUFJLEdBQUosY0FBZSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkMsZ0NBQUssR0FBTCxjQUFnQixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekMsaUNBQU0sR0FBTixjQUFpQixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFJM0MsMkNBQWdCLEdBQWhCLFVBQWlCLFNBQWlCLEVBQUUsT0FBNEIsSUFBUSxDQUFDO0lBQ3pFLHdDQUFhLEdBQWIsVUFBYyxTQUFpQixJQUFRLENBQUM7SUFDMUMsdUJBQUM7QUFBRCxDQUFDLEFBWEQsSUFXQyJ9