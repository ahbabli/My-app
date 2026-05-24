<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('profiles', 'story_photo_url')) {
            return;
        }

        Schema::table('profiles', function (Blueprint $table) {
            $table->string('story_photo_url', 1000)->nullable()->after('photo_url');
        });
    }

    public function down(): void
    {
        if (!Schema::hasColumn('profiles', 'story_photo_url')) {
            return;
        }

        Schema::table('profiles', function (Blueprint $table) {
            $table->dropColumn('story_photo_url');
        });
    }
};
