<?php

namespace App\Filament\Resources;

use App\Enums\ReportReason;
use App\Filament\Resources\UserResource\Pages;
use App\Filament\Resources\UserResource\RelationManagers\CommentsRelationManager;
use App\Filament\Resources\UserResource\RelationManagers\FriendOfRelationManager;
use App\Filament\Resources\UserResource\RelationManagers\FriendsRelationManager;
use App\Filament\Resources\UserResource\RelationManagers\InvitesRelationManager;
use App\Filament\Resources\UserResource\RelationManagers\PulsesRelationManager;
use App\Filament\Resources\UserResource\RelationManagers\ReceivedFriendRequestsRelationManager;
use App\Filament\Resources\UserResource\RelationManagers\ReceivedMessagesRelationManager;
use App\Filament\Resources\UserResource\RelationManagers\SentFriendRequestsRelationManager;
use App\Filament\Resources\UserResource\RelationManagers\SentMessagesRelationManager;
use App\Filament\Resources\UserResource\RelationManagers\TeamsRelationManager;
use App\Filament\Resources\UserResource\RelationManagers\UnreadMessagesRelationManager;
use App\Models\User;
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Resources\RelationManagers\RelationGroup;
use Filament\Resources\Resource;
use Filament\Tables\Actions\Action;
use Filament\Tables\Actions\BulkActionGroup;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\DeleteBulkAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $slug = 'users';

    protected static ?string $navigationIcon = 'heroicon-o-users';

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('email')
                    ->searchable()
                    ->sortable()
                    ->limit(15),

                ImageColumn::make('profile_image'),

                TextColumn::make('last_activity')
                    ->date(),

                TextColumn::make('is_suspended')
                    ->label('Suspended')
                    ->badge()
                    ->formatStateUsing(fn (bool $state): string => $state ? 'Yes' : 'No'),

                TextColumn::make('suspension_reason')
                    ->label('Suspension Reason')
                    ->getStateUsing(function (User $record): ?string {
                        return $record->is_suspended ? ($record->suspensionReason() ?: 'No reason provided') : '';
                    })
                    ->placeholder('not suspended'),

            ])
            ->filters([
                //
            ])
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
                Action::make('toggleSuspension')
                    ->label(fn (User $record): string => $record->is_suspended ? 'Unsuspend' : 'Suspend')
                    ->icon(fn (User $record): string => $record->is_suspended ? 'heroicon-o-lock-open' : 'heroicon-o-lock-closed')
                    ->action(function (User $record, array $data): void {
                        $record->is_suspended = ! $record->is_suspended;
                        if ($record->is_suspended) {
                            $record->addSuspensionReason($data['suspension_reason']);
                            if ($data['suspension_reason'] === ReportReason::Other->name) {
                                $record->addSuspensionReason($data['custom_suspension_reason']);
                            }
                        }
                        $record->save();
                    })
                    ->form([
                        Select::make('suspension_reason')
                            ->label('Suspension Reason')
                            ->options(
                                collect(ReportReason::cases())->flatMap(fn ($reason) => [
                                    Str::headline($reason->name) => Str::headline($reason->name),
                                ])
                            )->required()
                            ->visible(fn (User $record): bool => ! $record->is_suspended)
                            ->reactive(),
                        TextInput::make('custom_suspension_reason')
                            ->label('Custom Suspension Reason')
                            ->required()
                            ->visible(fn (User $record, Get $get): bool => ! $record->is_suspended && $get('suspension_reason') === ReportReason::Other->name),
                    ])
                    ->requiresConfirmation(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),

                ]),
            ]);
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('name')
                    ->required(),

                TextInput::make('email')
                    ->required(),

                DatePicker::make('email_verified_at')
                    ->label('Email Verified Date'),

                TextInput::make('password')
                    ->required(),

                DatePicker::make('last_time_online'),

                Placeholder::make('created_at')
                    ->label('Created Date')
                    ->content(fn (?User $record): string => $record?->created_at?->diffForHumans() ?? '-'),

                Placeholder::make('updated_at')
                    ->label('Last Modified Date')
                    ->content(fn (?User $record): string => $record?->updated_at?->diffForHumans() ?? '-'),

                Select::make('current_team_id')
                    ->relationship('currentTeam', 'name')
                    ->searchable(),

                Checkbox::make('is_suspended'),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            RelationGroup::make('Friend Management', [
                ReceivedFriendRequestsRelationManager::class,
                SentFriendRequestsRelationManager::class,
                FriendOfRelationManager::class,
                FriendsRelationManager::class,
            ]),
            RelationGroup::make('Chat', [
                ReceivedMessagesRelationManager::class,
                SentMessagesRelationManager::class,
                UnreadMessagesRelationManager::class,
            ]),
            RelationGroup::make('Teams', [
                InvitesRelationManager::class,
                TeamsRelationManager::class,
            ]),

            RelationGroup::make('User Activity', [
                PulsesRelationManager::class,
                CommentsRelationManager::class,
            ]),
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record:id}/edit'),
        ];
    }

    public static function getGlobalSearchEloquentQuery(): Builder
    {
        return parent::getGlobalSearchEloquentQuery()->with(['currentTeam']);
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['name', 'email', 'currentTeam.name'];
    }

    public static function getGlobalSearchResultDetails(Model $record): array
    {
        $details = [];

        if ($record->currentTeam) {
            $details['CurrentTeam'] = $record->currentTeam->name;
        }

        return $details;
    }
}
