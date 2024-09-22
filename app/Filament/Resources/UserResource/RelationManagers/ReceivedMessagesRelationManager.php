<?php

namespace App\Filament\Resources\UserResource\RelationManagers;

use App\Models\Message;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Actions\BulkActionGroup;
use Filament\Tables\Actions\CreateAction;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\DeleteBulkAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Actions\ForceDeleteAction;
use Filament\Tables\Actions\ForceDeleteBulkAction;
use Filament\Tables\Actions\RestoreAction;
use Filament\Tables\Actions\RestoreBulkAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ReceivedMessagesRelationManager extends RelationManager
{
    protected static string $relationship = 'receivedMessages';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Select::make('sender_id')
                    ->relationship('sender', 'name')
                    ->searchable()
                    ->required(),

                TextInput::make('message')
                    ->required(),

                TextInput::make('type')
                    ->required(),

                DatePicker::make('seen_at')
                    ->label('Seen Date'),

                Select::make('team_id')
                    ->relationship('team', 'name')
                    ->searchable(),

                Placeholder::make('created_at')
                    ->label('Created Date')
                    ->content(fn (?Message $record): string => $record?->created_at?->diffForHumans() ?? '-'),

                Placeholder::make('updated_at')
                    ->label('Last Modified Date')
                    ->content(fn (?Message $record): string => $record?->updated_at?->diffForHumans() ?? '-'),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('id')
            ->columns([
                TextColumn::make('sender.name')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('message'),

                TextColumn::make('type'),

                TextColumn::make('seen_at')
                    ->label('Seen Date')
                    ->date(),

                TextColumn::make('team.name')
                    ->searchable()
                    ->sortable(),
            ])
            ->filters([
                TrashedFilter::make(),
            ])
            ->headerActions([
                CreateAction::make(),
            ])
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
                RestoreAction::make(),
                ForceDeleteAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                    RestoreBulkAction::make(),
                    ForceDeleteBulkAction::make(),
                ]),
            ])
            ->modifyQueryUsing(fn (Builder $query) => $query->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]));
    }
}
